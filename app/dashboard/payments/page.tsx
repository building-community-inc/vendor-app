import {
  getAllUserPaymentsById,
  getSanityUserByEmail,
} from "@/sanity/queries/user";
import { formatMarketDate } from "@/utils/helpers";
import { currentUser } from "@clerk/nextjs";

const PaymentsPage = async () => {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const user = await getSanityUserByEmail(
    clerkUser.emailAddresses[0].emailAddress
  );

  if (!user) {
    return null;
  }

  const userPayments = await getAllUserPaymentsById(user._id);

  // userPayments[0].items;

  return (
    <main className="flex flex-col pt-20 px-10 gap-2 min-h-screen w-full text-xs sm:text-sm md:text-base">
      <h1 className="font-bold text-xl pl-2">Payments</h1>
      <table className="text-left ">
        <thead>
          <tr>
            <th className="px-2">Purchased On</th>
            <th className="px-2">Amount</th>
            <th className="px-2">Market</th>
            <th className="px-2">Booked Dates</th>
          </tr>
        </thead>
        <tbody>
          {userPayments?.map((payment) => (
            <tr key={payment.stripePaymentIntendId}>
              <td className="whitespace-nowrap px-2 align-top">
                {formatMarketDate(payment.createdAt)}
              </td>
              <td className="px-2 align-top">${payment.amount / 100}</td>
              <td className="px-2 align-top">{payment.market.name}</td>
              <td className="px-2 align-top">
                <ul>
                  {payment.items.map((item, index) => (
                    <li key={item.name}>
                      {formatMarketDate(item.date)} - {item.tableId}
                      {index < payment.items.length - 1 ? ',' : ''}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};

export default PaymentsPage;
