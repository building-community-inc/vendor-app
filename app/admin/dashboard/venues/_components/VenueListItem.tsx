import { TVenueFront } from "@/sanity/queries/admin/venues";
import { camelCaseToTitleCase } from "@/utils/helpers";
import Image from "next/image";
import Link from "next/link";
import TableView from "./TableView";

const VenueListItem = ({ venue }: { venue: TVenueFront }) => {
  return (
    <li className="border border-secondary-admin-border rounded-[20px] py-2 px-3 flex flex-col">
      <Link href={`/admin/dashboard/venues/update/${venue._id}`}>
        <VenueCard venue={venue} withAvailableTables />
      </Link>
    </li>
  );
};

export default VenueListItem;

type TVenueCardProps = {
  venue: TVenueFront;
  withAvailableTables?: boolean;
};
export const VenueCard = ({ venue, withAvailableTables }: TVenueCardProps) => {
  return (
    <>
      <h2 className="font-semibold text-center capitalize">{venue.title}</h2>
      {venue.venueMap && (
        <Image
          src={venue.venueMap.url}
          width={"500"}
          height={"500"}
          alt={venue.title}
          className="w-full max-w-[500px] mx-auto"
        />
      )}
      <div className="flex items-center">
        <section className="w-1/2">
          {Object.entries(venue)
            .filter(
              ([key, _]) =>
                key !== "venueMap" &&
                key !== "title" &&
                key !== "_id" &&
                key !== "loadInInstructions" &&
                key !== "tables"
            )
            .map(([key, value]) => (
              <p key={key} className="max-w-full">
                <strong className="capitalize">
                  {camelCaseToTitleCase(key)}:
                </strong>{" "}
                {typeof value === "string" && value}
              </p>
            ))}
        </section>

        {withAvailableTables && (
          <div className="mx-auto w-fit">
            <TableView
              title="Available Tables"
              amount={venue.tables.length}
              // type="available"
            />
          </div>
        )}
      </div>
    </>
  );
};

