import { unstable_noStore } from "next/cache";
import Box from "../../markets/[id]/select-preferences/_components/Box";
import { getPaymentByIdWithMarket } from "@/sanity/queries/payments";
import { formatDateWLuxon } from "@/utils/helpers";

const Page = async ({ params }: {
  params: {
    paymentRecordId: string;
  };
}) => {
  unstable_noStore();
  console.log({ paymentRecordId: params.paymentRecordId });

  const paymentRecordInfo = await getPaymentByIdWithMarket(params.paymentRecordId);

  console.log({ paymentRecordInfo, payments: paymentRecordInfo.payments });

  return (
    <main className="pt-10 flex flex-col items-center">

      <Box>
        <header>

          <h1 className="text-2xl font-bold font-darker-grotesque text-black">Booking Details </h1>
          <span>Vendor Table for has been reserved for:</span>
          <h2 className="font-bold">{paymentRecordInfo.market.name}</h2>
        </header>

        <section className="bg-blue-200 w-full">
          {/* <h2 className="font-bold">Date</h2> */}
          <header className="flex justify-between w-full">
            <h3 className="text-2xl font-bold font-darker-grotesque text-black flex-1">Date:</h3>
            <h3 className="text-2xl font-bold font-darker-grotesque text-black flex-1">Table Id:</h3>
            <h3 className="text-2xl font-bold font-darker-grotesque text-black flex-1">Price:</h3>

          </header>
          <ul className="flex flex-col gap-2 w-full bg-yellow-300">
            {paymentRecordInfo.items.map(item => (
              <li key={item.tableId} className="flex justify-between gap-2 bg-red-200 w-full">
                <div className="flex-1">
                  <span>{formatDateWLuxon(item.date)}</span>
                </div>
                <div className="flex-1">
                  <span>{item.tableId}</span>
                </div>
                <div className="flex-1">
                  <span>${item.price}</span>
                </div>
                {/* <div>
                  <h3>Price:</h3>
                  <span>${item.}</span>
                </div> */}
              </li>
            ))}
          </ul>
          <div className="">
            <h3>HST</h3>
            <p>${paymentRecordInfo.amount.hst}</p>
          </div>
          <div className="">
            <h3>Total</h3>
            <p>${paymentRecordInfo.amount.total}</p>
          </div>
        </section>
      </Box>
    </main>
  );
}

export default Page;