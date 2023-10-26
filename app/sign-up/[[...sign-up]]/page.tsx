
import { clerkLoginAppearance } from "@/app/page";
import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
    <main className="grid place-content-center min-h-screen">
      <Image src={"/logo.png"} alt="logo" width={468} height={468} />
      <SignUp
        appearance={clerkLoginAppearance}
      />
    </main>
  );
}