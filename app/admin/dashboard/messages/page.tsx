import Search from "@/app/dashboard/explore/_components/Search";
import FormTitleDivider from "../_components/FormTitleDivider";
import Link from "next/link";
import { TMessage, getAllSentMessages } from "@/sanity/queries/admin/messages";
import Dropdown from "./_components/Dropdown";

const Page = async ({
  searchParams,
}: {
  searchParams: {
    [key: string]: string | undefined;
  };
}) => {
  const messages = await getAllSentMessages();

  const search = searchParams.search?.toLowerCase();

  const filterMessages = (arrayMessages: TMessage[]) => arrayMessages.filter((message) => {
    if (!search) {
      return true;
    }

    return message.subject.toLowerCase().includes(search) 
    || message.for.some(receiver => receiver.vendor.email.toLowerCase().includes(search))
    || message.for.some(receiver => receiver.vendor.business?.name?.toLowerCase().includes(search))
    || message.for.some(receiver => `${receiver.vendor.firstName} ${receiver.vendor.lastName}`.toLowerCase().includes(search))

  });

  return (
    <main className="pt-14 px-5 w-full min-h-screen mx-auto">
      <header className="flex w-full justify-between">
        <h1 className="font-segoe font-bold md:text-lg lg:text-3xl">Message Centre</h1>
        <Search urlForSearch="/admin/dashboard/messages" theme="light" placeholder="Find a Message" />
      </header>
      <Link href="/admin/dashboard/messages/create">
        Compose Message
      </Link>
      <FormTitleDivider title="Sent Messages" />
      <ul>
        {messages && filterMessages(messages).map((message) => (
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
                <ul className="flex flex-col gap-2">
                  {message.for.map(({vendor}) => (
                    <li className="flex flex-col">
                      <span>
                        {vendor.email}
                      </span>
                      <div className="flex text-xs gap-2">
                        {vendor.business ? (

                          <span className="flex gap-2">
                            <strong>
                              Business Name:
                            </strong>
                            {vendor.business?.name}
                          </span>
                        ) : (
                          <span>
                            <strong>
                              No Business Info
                            </strong>
                          </span>
                        )}
                        <span className="flex gap-2">
                          <strong>
                            Contact Name:
                          </strong>
                          {vendor.firstName} {vendor.lastName}
                        </span>
                      </div>

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