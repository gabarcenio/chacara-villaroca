import { BookingExperience } from "@/components/BookingExperience";
import { PropertyStory } from "@/components/PropertyStory";

export default function HomePage() {
  return (
    <main>
      <BookingExperience>
        <PropertyStory />
      </BookingExperience>
    </main>
  );
}
