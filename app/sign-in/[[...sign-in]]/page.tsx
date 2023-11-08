
import { clerkLoginAppearance } from "@/app/page";
import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
    <main className="grid place-content-center min-h-screen">
      <Image src={"/logo-on-black-bg-low-res.png"} alt="logo" width={468} height={468} />
      <SignIn
        appearance={clerkLoginAppearance}
        afterSignUpUrl={"/create-user"}
      />
    </main>
  );
}