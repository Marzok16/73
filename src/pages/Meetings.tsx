import Navigation from "@/components/Navigation";
import MeetingGroupCards from "@/components/MeetingGroupCards";

const Meetings = () => {
  return (
    <div>
      <Navigation />
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <MeetingGroupCards />
        </div>
      </div>
    </div>
  );
};

export default Meetings;