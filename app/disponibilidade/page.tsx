import { BookingExperience } from "@/components/BookingExperience";
import { SiteHeader } from "@/components/SiteHeader";

export default function AvailabilityPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <BookingExperience hero={false} />
      </main>
    </>
  );
}
