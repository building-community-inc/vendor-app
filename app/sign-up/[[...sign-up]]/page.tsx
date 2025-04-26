import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import SignUpForm from "./SignUp";

export default async function Page() {
  const user = await currentUser();
  if (user) {
    redirect("/dashboard");
  }
  return (
    <main className="grid place-content-center min-h-screen py-10">
      <Image
        src="/logo-on-white-bg.png"
        className="w-[200px] h-[200px] md:w-[468px] md:h-[468px] mx-auto"
        width={468}
        height={468}
        alt="logo"
      />
      <SignUpForm />
    </main>
  );
}
