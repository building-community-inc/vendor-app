import { TVenueFront } from "@/sanity/queries/admin/venues";
import VenueListItem from "./VenueListItem";

const VenueList = ({ venues }: { venues: TVenueFront[] }) => {
  return (
    <ul className="flex flex-col gap-2 my-2">
      {venues?.map((venue) => (
        <VenueListItem key={venue._id} venue={venue} />
      ))}
    </ul>
  );
};

export default VenueList;
