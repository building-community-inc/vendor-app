import Dropdown from "@/app/admin/dashboard/messages/_components/Dropdown";
import { getAllUserMessagesById } from "@/sanity/queries/messages";
import { getSanityUserByEmail } from "@/sanity/queries/user";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import OpenBody from "./_components/OpenBody";

const Page = async () => {
  const user = await currentUser();
  if (!user) redirect("/");

  const sanityUser = await getSanityUserByEmail(
    user.emailAddresses[0].emailAddress
  );

  if (!sanityUser) redirect("/");

  const userMessages = await getAllUserMessagesById(sanityUser._id);

  if (!userMessages) return (
    <main className="pt-14 px-5 w-full max-w-3xl mx-auto flex flex-col gap-8">
      <h1>{"Messages"}</h1>
      <p>{"No messages"}</p>
    </main>
  )

  return (
    <main className="pt-14 px-5 w-full max-w-3xl mx-auto flex flex-col gap-8">
      <h1 className="font-bold text-2xl">{"Messages"}</h1>
      <ul>
        {userMessages.map((message) => {
          const forObject = message.for.find(forObject => forObject.vendor._id === sanityUser._id);
          const isRead = forObject ? forObject.read : false;
          return (
          <li key={message._id} className="flex flex-col gap-2 border-[#707070] border-b">
            <header className="flex gap-2 flex-wrap">
              <strong>Sent By:</strong>
              <span>
                {message.from.email}
              </span>
              <p className="flex gap-2">
                <strong>
                  Subject:
                </strong>
                {message.subject}
              </p>
            </header>
            <div className="flex gap-5">
              <section className="flex max-w-[50vw]">
                <strong>Read:</strong> {isRead ? "Yes" : "No"}
              </section>
            </div>
            <footer className="flex flex-col">
              <OpenBody isMessageRead={isRead ?? false} body={message.body} messageId={message._id} userId={sanityUser._id} />
            </footer>

          </li>
        )})}
      </ul>
    </main>
  );
}

export default Page;