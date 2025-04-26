"use client";
import { useActionState } from "react";
import { TUserWithOptionalBusinessRef } from "@/zod/user-business";
import Image from "next/image";
import SelectVendor from "./SelectVendor";
import SelectDetails from "./SelectDetails";
import { createBooking } from "./createBooking";
import Button from "@/app/_components/Button";
import Link from "next/link";
import { TSanityMarket } from "@/sanity/queries/admin/markets/zods";

const CreateBookingForm = ({
  market,
  allVendors,
  sanityUser,
}: {
  market: TSanityMarket;
  allVendors: TUserWithOptionalBusinessRef[];
  sanityUser: TUserWithOptionalBusinessRef;
}) => {
  const [formState, formAction] = useActionState(createBooking, {
    errors: [],
    success: false,
  });

  if (formState.success) {
    return (
      <div>
        <h1>Booking Created Successfully</h1>
        <Button
          className="rounded-none bg-black text-white py-4 px-6 text-lg mx-auto my-10"
          type="button"
        >
          <Link href={`/admin/dashboard/markets/${market._id}`}>
            Back to Market
          </Link>
        </Button>
      </div>
    );
  }
  return (
    <form action={formAction}>
      {market.venue.venueMap && (
        <Image
          src={market.venue.venueMap.url}
          alt={market.venue.title}
          width={500}
          height={500}
          className="w-full mx-auto"
        />
      )}
      <SelectVendor allVendors={allVendors} />

      <SelectDetails market={market} user={sanityUser} />

      <Link href={`/admin/dashboard/markets/${market._id}`}>
        <Button
          className="rounded-none bg-black text-white py-4 px-6 text-lg mx-auto my-10"
          type="button"
        >
          Back to Market
        </Button>
      </Link>

      {formState.errors && formState.errors.length > 0 && (
        <ul className="flex flex-col w-fit mx-auto">
          {formState.errors.map((err) => (
            <li key={err} className="text-red-700 text-left">
              * {err}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};

export default CreateBookingForm;
