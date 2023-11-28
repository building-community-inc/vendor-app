import { TVenueFront } from "@/sanity/queries/admin/venues";
import { camelCaseToTitleCase } from "@/utils/helpers";
import Image from "next/image";
import Link from "next/link";

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
          className="w-full"
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

const TableView = ({
  amount,
  title,
  type = "available",
}: {
  amount: number;
  title: string;
  type?: "available" | "applied" | "confirmed";
}) => {
  const colors = {
    confirmed: "#26AE05",
    available: "#03628D",
    applied: "#DBE20E",
  };
  return (
    <div
      className={`flex flex-col font-roboto items-center p-2 py-4 border-4 w-fit rounded-[20px]`}
      style={{ borderColor: colors[type] }}
    >
      <strong className="text-xs font-extrabold">{title}</strong>
      <p className="font-extrabold text-2xl">{amount}</p>
    </div>
  );
};
