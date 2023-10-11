import { SignIn } from "@clerk/nextjs";

export default function Page({searchParams}: {searchParams: {redirectUrl: string | undefined}}) {
  const {redirectUrl} = searchParams;
  return (
    <main className="grid place-content-center min-h-screen">
      <SignIn redirectUrl={redirectUrl || "/"}/>
    </main>
  );
}