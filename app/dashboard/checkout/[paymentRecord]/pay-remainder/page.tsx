import { getPaymentById } from "@/sanity/queries/payments";
import RemainderCheckout from "./RemainderCheckout";
import { getMarketById } from "@/sanity/queries/admin/markets/markets";
import { currentUser } from "@clerk/nextjs";
import { getSanityUserByEmail } from "@/sanity/queries/user";

const Page = async ({ params }: {
  params: {
    paymentRecord: string;
  }
}) => {
  const user = await currentUser();

  if (!user) {
    return <div>Not authorized</div>
  }

  const sanityUser = await getSanityUserByEmail(user.emailAddresses[0].emailAddress);

  if (!sanityUser) {
    return <div>Not authorized</div>
  }

  const paymentRecord = await getPaymentById(params.paymentRecord);

  const market = await getMarketById(paymentRecord.marketId)

  if (!paymentRecord || !market) {
    return <div>Payment Record not found</div>
  }

  return (
    <div>
      <RemainderCheckout
        owed={paymentRecord.amount.owed}
        items={paymentRecord.items.map(item => ({
          date: item.date,
          tableId: item.tableId,
          price: item.price,
          name: market.name
        }))}
        market={{
          _id: market._id,
          name: market.name,
          venue: market.venue,
        }}
        price={paymentRecord.amount.total}
        totalWithHst={paymentRecord.amount.total + paymentRecord.amount.hst}
        paymentRecordId={paymentRecord._id}
        userEmail={sanityUser.email}
      />
    </div>
  );
}

export default Page;