import { getMarketById } from "@/sanity/queries/admin/markets";
import FormTitleDivider from "../../../_components/FormTitleDivider";
import { dateArrayToDisplayableText } from "@/utils/helpers";
import Image from "next/image";
import { getAllVendors } from "@/sanity/queries/admin/vendors";
import SelectVendor from "./SelectVendor";
import SelectOptions from "@/app/dashboard/markets/[id]/select-preferences/_components/SelectOptions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import SelectDates from "@/app/dashboard/markets/[id]/select-preferences/_components/SelectDates";
import SelectDetails from "./SelectDetails";
import CreateBookingForm from "./CreateBookingForm";

const Page = async ({
  params,
}: {
  params: {
    id: string;
  };

}) => {
  const market = await getMarketById(params.id);

  const user = await currentUser();

  if (!user) redirect("/");

  const sanityUser = await getSanityUserByEmail(
    user.emailAddresses[0].emailAddress
  );

  if (!market) return <div>loading...</div>;


  const allVendors = await getAllVendors();

  if (!allVendors) return <div>loading...</div>;




  return (
    <main className="pt-14 px-5 w-[80%] min-h-screen max-w-3xl mx-auto">
      <FormTitleDivider title="Create a booking" />
      <h2><strong>{dateArrayToDisplayableText(market.dates)}</strong></h2>
      <h2><strong>{market.name}</strong></h2>
      <CreateBookingForm allVendors={allVendors} market={market} sanityUser={sanityUser} />

    </main>
  );
}

export default Page;