"use client"
import { TSanityMarket } from "@/sanity/queries/admin/markets";
import { TUserWithOptionalBusinessRef } from "@/zod/user-business";
import Image from "next/image";
import { useFormState } from "react-dom";
import SelectVendor from "./SelectVendor";
import SelectDetails from "./SelectDetails";
import { TVendor } from "@/sanity/queries/admin/vendors";
import { createBooking } from "./createBooking";
import Button from "@/app/_components/Button";

const CreateBookingForm = ({ market, allVendors, sanityUser }: {
  market: TSanityMarket;
  allVendors: TVendor[];
  sanityUser: TUserWithOptionalBusinessRef;
}) => {

  const [formState, formAction] = useFormState(createBooking, { errors: [], success: false })
  console.log({ formState })
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


      <Button className="rounded-none bg-black text-white py-4 px-6 text-lg mx-auto my-10" type="submit">Complete Booking</Button>

      {formState.errors.length > 0 && (
        <ul className="flex flex-col w-fit mx-auto">
          {formState.errors.map(err => (
            <li key={err} className="text-red-700 text-left">* {err}</li>
          ))}
        </ul>
      )}
    </form>

  );
}

export default CreateBookingForm;