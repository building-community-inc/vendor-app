import { getMarketById } from "@/sanity/queries/admin/markets/markets";
import FormTitleDivider from "../../../_components/FormTitleDivider";
import { dateArrayToDisplayableText } from "@/utils/helpers";
import { getAllVendors } from "@/sanity/queries/admin/vendors";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import CreateBookingForm from "./CreateBookingForm";
import { unstable_noStore } from "next/cache";

const Page = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const params = await props.params;
  unstable_noStore();
  const market = await getMarketById(params.id);

  const user = await currentUser();

  if (!user) redirect("/");

  const sanityUser = await getSanityUserByEmail(
    user.emailAddresses[0].emailAddress
  );

  if (!market || !sanityUser) return <div>loading...</div>;

  const allVendors = await getAllVendors();

  if (!allVendors) return <div>loading...</div>;

  return (
    <main className="pt-14 px-5 w-[80%] min-h-screen max-w-3xl mx-auto">
      <FormTitleDivider title="Create a booking" />
      <h2>
        <strong>{dateArrayToDisplayableText(market.dates)}</strong>
      </h2>
      <h2>
        <strong>{market.name}</strong>
      </h2>
      <CreateBookingForm
        allVendors={allVendors}
        market={market}
        sanityUser={sanityUser}
      />
    </main>
  );
};

export default Page;
