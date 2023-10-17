import { currentUser, UserButton, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
export default async function Home() {
  const user = await currentUser();

  if (user) {
    return (
      <main className="grid place-content-center gap-2 min-h-screen">
        <div className="flex items-center gap-2">
          <UserButton afterSignOutUrl="/" />
          <h2>Welcome back {user.firstName}!</h2>
          <SignOutButton />
        </div>
      </main>
    );
  }
  return (
    <main className="grid place-content-center min-h-screen">
      <Link href="/sign-up">Sign Up / Sign In</Link>
    </main>
  );
}
