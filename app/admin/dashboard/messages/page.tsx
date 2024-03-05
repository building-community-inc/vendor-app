import Search from "@/app/dashboard/explore/_components/Search";
import FormTitleDivider from "../_components/FormTitleDivider";
import Link from "next/link";

const Page = () => {
  return (
    <main className="pt-14 px-5 w-full min-h-screen mx-auto">
      <header className="flex w-full justify-between">
        <h1 className="font-segoe font-bold text-lg lg:text-3xl">Message Centre</h1>
        <Search urlForSearch="/admin/dashboard/messages" theme="light" placeholder="Find a Message" />
      </header>
      <FormTitleDivider title="Messages" />
      <Link href="/admin/dashboard/messages/create">
        Compose Message
      </Link>
    </main>
  );
}

export default Page;