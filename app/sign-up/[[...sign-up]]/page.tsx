import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
    <main className="grid place-content-center min-h-screen">
      <Image src="/logo-on-white-bg.png"
        className="w-[200px] h-[200px] md:w-[468px] md:h-[468px] mx-auto"
        width={468} height={468} alt="logo" />
      <SignUp
        // appearance={clerkLoginAppearance}
      />
    </main>
  );
}
