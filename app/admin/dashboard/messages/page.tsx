import Search from "@/app/dashboard/explore/_components/Search";
import FormTitleDivider from "../_components/FormTitleDivider";
import Link from "next/link";
import { getAllSentMessages } from "@/sanity/queries/admin/messages";
import Dropdown from "./_components/Dropdown";

const Page = async () => {
  const messages = await getAllSentMessages();
  return (
    <main className="pt-14 px-5 w-full min-h-screen mx-auto">
      <header className="flex w-full justify-between">
        <h1 className="font-segoe font-bold text-lg lg:text-3xl">Message Centre</h1>
        <Search urlForSearch="/admin/dashboard/messages" theme="light" placeholder="Find a Message" />
      </header>
      <Link href="/admin/dashboard/messages/create">
        Compose Message
      </Link>
      <FormTitleDivider title="Sent Messages" />
      <ul>
        {messages?.map((message) => (
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
              <section className="flex gap-2">
                <strong>Sent to:</strong>
                <ul>
                  {message.for.map(receiver => (
                    <li className="flex gap-2">
                      <span>
                        {receiver.vendor.email}
                      </span>
                      <span>
                        <strong>read: </strong>{receiver.read ? "yes" : "no"}
                      </span>

                    </li>
                  ))}
                </ul>
              </section>
              <section className="flex max-w-[50vw]">
              </section>
            </div>
            <footer className="flex flex-col">
              <Dropdown title="Body">
                <span className="">
                  {message.body}
                </span>
              </Dropdown>
            </footer>

          </li>
        ))}
      </ul>
    </main>
  );
}

export default Page;