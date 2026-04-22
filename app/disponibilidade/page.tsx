import { BookingExperience } from "@/components/BookingExperience";
import { SiteHeader } from "@/components/SiteHeader";

export default function AvailabilityPage() {
  return (
    <div style={{ background: "#0c0a08", minHeight: "100vh" }}>
      <SiteHeader dark />
      <main>
        <BookingExperience hero={false} />
      </main>
    </div>
  );
}
