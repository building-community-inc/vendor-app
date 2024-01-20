import {
  getAllUserPaymentsById,
  getSanityUserByEmail,
} from "@/sanity/queries/user";
import { formatMarketDate, formatMarketWithDateTime } from "@/utils/helpers";
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
      <header className="flex items-center justify-between gap-2">
        <h1 className="font-bold text-xl">Payments</h1>
        <div className="flex-grow h-[1px] bg-white" />
      </header>

      <ul className="flex flex-col">
        {userPayments?.map((payment) => (
          <li key={payment.stripePaymentIntendId} className="border-b border-white">
            <InfoItem title="Id">
              <p>
                {payment.stripePaymentIntendId}
              </p>
            </InfoItem>
            <InfoItem title="Date">
              <p>
                {formatMarketWithDateTime(payment.createdAt)}
              </p>
            </InfoItem>
            <span className="font-bold">
              {formatMarketDate(payment.createdAt)}
            </span>
            <span>${payment.amount / 100}</span>
            <ul>
              {payment.items?.map((item) => (
                <li key={item.name}>
                  <span>{item.tableId}</span>
                  <span>{item.date}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default PaymentsPage;


const InfoItem = ({ title, children }: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex md:flex-col">
      <h3 className="font-bold">
        {title}:
      </h3>
      {children}
    </div>
  )
}