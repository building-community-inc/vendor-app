import { SignIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await currentUser();
  if (user) {
    redirect("/dashboard");
  }
  return (
    <main className="grid place-content-center min-h-screen py-10 gap-5">
      <Image
        src="/logo-on-white-bg.png"
        className="w-[200px] h-[200px] md:w-[468px] md:h-[468px] mx-auto"
        width={468}
        height={468}
        alt="logo"
      />
      <div className="flex justify-center">
        <SignIn
        // appearance={clerkLoginAppearance}
        // signUpFallbackRedirectUrl={"/add-user-to-sanity"}
        // signInUrl="/dashboard"
        />
      </div>
    </main>
  );
}
