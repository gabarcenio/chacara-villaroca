// Autentique — Brazilian e-signature platform (LGPD-compliant)
// Docs: https://docs.autentique.com.br/api
// Get your API token at: https://painel.autentique.com.br/perfil/api
// Set AUTENTIQUE_API_TOKEN in .env.local to activate.

const ENDPOINT = "https://api.autentique.com.br/v2/graphql";
const TOKEN = process.env.AUTENTIQUE_API_TOKEN;

export function isAutentiqueConfigured() {
  return Boolean(TOKEN);
}

// Creates a document with a signer and sends it for signature via email.
// Returns the document ID and the short signing link for the signer.
export async function createAndSendContract(opts: {
  documentName: string;
  contractHtml: string; // HTML content of the contract
  signerEmail: string;
  signerName: string;
}): Promise<{ documentId: string; signingLink: string }> {
  const mutation = `
    mutation CreateDocumentMutation(
      $document: DocumentInput!,
      $signers: [SignerInput!]!,
      $file: Upload!
    ) {
      createDocument(document: $document, signers: $signers, file: $file) {
        id
        name
        signatures {
          public_id
          email
          link { short_link }
        }
      }
    }
  `;

  const variables = {
    document: { name: opts.documentName },
    signers: [{ email: opts.signerEmail, action: "SIGN" }],
  };

  // Autentique uses multipart/form-data for file upload alongside the GraphQL query
  const formData = new FormData();
  formData.append("operations", JSON.stringify({ query: mutation, variables }));
  formData.append("map", JSON.stringify({ "0": ["variables.file"] }));

  const htmlBlob = new Blob([opts.contractHtml], { type: "text/html" });
  formData.append("0", htmlBlob, opts.documentName.endsWith(".html") ? opts.documentName : `${opts.documentName}.html`);

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}` },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Autentique createDocument → ${res.status}: ${text}`);
  }

  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(`Autentique GraphQL error: ${json.errors[0].message}`);
  }

  const doc = json.data.createDocument;
  const signer = doc.signatures?.find((s: { email: string }) => s.email === opts.signerEmail);

  return {
    documentId: doc.id as string,
    signingLink: (signer?.link?.short_link ?? "") as string,
  };
}
