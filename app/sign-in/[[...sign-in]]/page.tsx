
import { clerkLoginAppearance } from "@/app/_components/clerk/styles";
import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
    <main className="grid place-content-center min-h-screen ">
      <Image src="/logo-on-white-bg.png" width={468} height={468} alt="logo" />
      <SignIn
        appearance={clerkLoginAppearance}
        afterSignUpUrl={"/add-user-to-sanity"}
      />
    </main>
  );
}