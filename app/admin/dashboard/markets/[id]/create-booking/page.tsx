import { getMarketById } from "@/sanity/queries/admin/markets";
import FormTitleDivider from "../../../_components/FormTitleDivider";
import { dateArrayToDisplayableText } from "@/utils/helpers";
import Image from "next/image";
import { getAllVendors } from "@/sanity/queries/admin/vendors";
import SelectVendor from "./SelectVendor";

const Page = async ({
  params,
}: {
  params: {
    id: string;
  };

}) => {
  const market = await getMarketById(params.id);

  if (!market) return <div>loading...</div>;


  const allVendors = await getAllVendors();

  if (!allVendors) return <div>loading...</div>;

  console.log({ allVendors })
  return (
    <main className="pt-14 px-5 w-[80%] min-h-screen max-w-3xl mx-auto">
      <FormTitleDivider title="Create a booking" />
      <h2><strong>{dateArrayToDisplayableText(market.dates)}</strong></h2>
      <h2><strong>{market.name}</strong></h2>
      {market.venue.venueMap && (
        <Image
          src={market.venue.venueMap.url}
          alt={market.venue.title}
          width={500}
          height={500}
          className="w-full mx-auto"
        />
      )}
      <SelectVendor allVendors={allVendors} />
      



    </main>
  );
}

export default Page;