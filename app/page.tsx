import { currentUser, UserButton, SignOutButton, SignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import Button from "./_components/Button";

export const clerkLoginAppearance = {
  variables: {
    colorBackground: "transparent",
    colorPrimary: "#fff",
    colorTextOnPrimaryBackground: "#191919",
  },
  elements: {
    card: {
      boxShadow: "none",
      border: "none",
    },
    header: {
      display: "none",
    },
    formFieldLabel: {
      color: "#fff",
    },
    socialButtons: {
      background: "#fff",
      borderRadius: "0.5rem",
    },
    footerActionText: {
      color: "#fff",
    },
  },
};
export default async function Home() {
  const user = await currentUser();

  if (user) {
    redirect("/dashboard");
  }
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <header>
        <Image src="/logo.png" width={468} height={468} alt="logo" />
      </header>
      <section className="flex flex-col items-center gap-6">
        <Link href="/sign-in">
          <Button>Login</Button>
        </Link>
        <Link href="/sign-up">
          <Button>Create Account</Button>
        </Link>
      </section>
    </main>
  );
}
