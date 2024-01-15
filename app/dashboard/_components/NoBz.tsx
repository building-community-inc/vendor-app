import Button from "@/app/_components/Button";
import Link from "next/link";

const NoBz = () => {
  return (
    <section className="flex flex-col gap-5 xl:gap-10 items-center justify-center w-full px-10">
      <h2 className="text-2xl font-bold">
        You have not created a business profile yet.
      </h2>
      <p className="text-xl">Please create a business profile to continue.</p>
      <Link href={"/create-business"}>
        <Button>Create Business Profile</Button>
      </Link>
    </section>
  );
};

export default NoBz;
