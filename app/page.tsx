import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import Button from "./_components/Button";

export default async function Home() {
  const user = await currentUser();

  if (user) {
    redirect("/dashboard");
  }
  return (
    <main className="flex flex-col gap-10 items-center justify-center h-[100dvh]">
      <header>
        <Image
          src="/logo-on-white-bg.png"
          className="w-[200px] h-[200px] md:w-[468px] md:h-[468px]"
          width={468}
          height={468}
          alt="logo"
        />
      </header>
      <section className="flex flex-col items-center gap-6">
        <Link href="/sign-in">
          <Button className="border font-darker-grotesque font-[900] text-base md:text-xl px-4 py-2 md:px-10 md:py-3">LOGIN</Button>
        </Link>
        <Link href="/sign-up">
          <Button className="border font-darker-grotesque font-[900] text-base md:text-xl px-4 py-2 md:px-10 md:py-3">CREATE ACCOUNT</Button>
        </Link>
      </section>
    </main>
  );
}
