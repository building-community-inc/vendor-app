import { TVenueFront } from "@/sanity/queries/venues";
import { camelCaseToTitleCase } from "@/utils/helpers";
import Image from "next/image";
import Link from "next/link";

const VenueListItem = ({ venue }: { venue: TVenueFront }) => {
  return (
    <li className="border border-secondary-admin-border rounded-[20px] py-2 px-3 flex flex-col">
      <Link href={`/admin/dashboard/venues/update/${venue._id}`}>
        <VenueCard venue={venue} />
      </Link>
    </li>
  );
};

export default VenueListItem;

export const VenueCard = ({ venue }: { venue: TVenueFront }) => {
  return (
    <>
      <h2 className="font-semibold text-center capitalize">{venue.title}</h2>
      <div className="flex flex-col md:flex-row items-center justify-between">
        <section>
          {Object.entries(venue)
            .filter(
              ([key, _]) =>
                key !== "venueMap" && key !== "title" && key !== "_id"
            )
            .map(([key, value]) => (
              <p key={key}>
                <strong className="capitalize">
                  {camelCaseToTitleCase(key)}:
                </strong>{" "}
                {typeof value === "string" && value}
              </p>
            ))}
        </section>
        {venue.venueMap && (
          <Image
            src={venue.venueMap.url}
            width={150}
            height={150}
            alt={venue.title}
          />
        )}
      </div>
    </>
  );
};
