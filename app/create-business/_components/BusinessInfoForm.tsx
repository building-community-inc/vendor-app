"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TBusinessInfo, TUserBase, zodBusinessInfo } from "@/zod/types";
import { sanityWriteClient } from "@/sanity/lib/client";

type TBIFProps = {
  user: TUserBase;
};
const BusinessInfoForm = ({user}: TBIFProps) => {
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TBusinessInfo>({
    resolver: zodResolver(zodBusinessInfo),
  });

  const onSubmit = async (data: TBusinessInfo) => {
    
    const updatedUser = {
      ...user,
      ...data
    }
    
    console.log({updatedUser})
    await sanityWriteClient.createOrReplace(updatedUser).then((res) => {
      console.log({res})
    }).catch((err) => {
      console.log({err})
    })
    // reset();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid mx-auto max-w-7xl px-5">
      <label htmlFor="businessName">Business Name</label>
      <input {...register("businessName")} className="text-black" type="text" name="businessName" />
      {errors.businessName && <span className="text-red-500">{errors.businessName.message}</span>}
      <label htmlFor="address1">Addess 1</label>
      <input {...register("address1")} className="text-black" type="text" name="address1" />
      {errors.address1 && <span className="text-red-500">{errors.address1.message}</span>}
      <label htmlFor="address2">Address 2</label>
      <input {...register("address2")} className="text-black" type="text" name="address2" />
      {errors.address2 && <span className="text-red-500">{errors.address2.message}</span>}
      <label htmlFor="city">City</label>
      <input {...register("city")} className="text-black" type="text" name="city" />
      {errors.city && <span className="text-red-500">{errors.city.message}</span>}
      <label htmlFor="province">Province</label>
      <input {...register("province")} className="text-black" type="text" name="province" />
      {errors.province && <span className="text-red-500">{errors.province.message}</span>}
      <label htmlFor="postalCode">Postal Code</label>
      <input {...register("postalCode")} className="text-black" type="text" name="postalCode" />
      {errors.postalCode && <span className="text-red-500">{errors.postalCode.message}</span>}
      <label htmlFor="country">Country</label>
      <input {...register("country")} className="text-black" type="text" name="country" />
      {errors.country && <span className="text-red-500">{errors.country.message}</span>}
      <label htmlFor="phone">Phone</label>
      <input {...register("phone")} className="text-black" type="text" name="phone" />
      {errors.phone && <span className="text-red-500">{errors.phone.message}</span>}
      <label htmlFor="instagramHandle">Instagram Handle</label>
      <input {...register("instagramHandle")} className="text-black" type="text" name="instagramHandle" />
      {errors.instagramHandle && <span className="text-red-500">{errors.instagramHandle.message}</span>}
      <button disabled={isSubmitting} className="disabled:bg-red-200" type="submit">Submit</button>
    </form>
  );
};

export default BusinessInfoForm;
