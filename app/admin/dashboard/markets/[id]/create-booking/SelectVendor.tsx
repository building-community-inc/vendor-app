"use client";
import { useEffect, useRef, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useClickOutside, useEscapeKey } from "@/app/_components/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { TUserWithOptionalBusinessRef } from "@/zod/user-business";
import Link from "next/link";
import { getVendorById } from "@/sanity/queries/admin/vendors";

const SelectVendor = ({ allVendors }: {
  allVendors: TUserWithOptionalBusinessRef[];
}) => {

  const searchParams = useSearchParams();

  const selectedVendorId = searchParams.get('selectedVendor');
  const [inputText, setInputText] = useState("")
  const [selectedVendor, setSelectedVendor] = useState<TUserWithOptionalBusinessRef | null>(null)
  const [isInputFocused, setInputFocused] = useState(false);
  const inputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchVendor = async () => {
      if (selectedVendorId) {

        const vendorData = await getVendorById(selectedVendorId);
        if (vendorData.success) {
          setSelectedVendor(vendorData.data);
        }
      }
    };
    fetchVendor();
  }, [selectedVendorId]);

  const filteredVendors = allVendors.filter(vendor => {
    if (inputText.trim() === '') {
      return true;
    }

    return (
      vendor.business?.businessName.toLowerCase().includes(inputText.toLowerCase()) ||
      vendor.email.toLowerCase().includes(inputText.toLowerCase()) ||
      vendor.firstName.toLowerCase().includes(inputText.toLowerCase()) ||
      vendor.lastName.toLowerCase().includes(inputText.toLowerCase())
    );
  });


  useClickOutside(inputRef, () => {
    // if 
    setInputFocused(false)
  })

  useEscapeKey(() => {
    setInputFocused(false)
  })

  return (
    <section className="w-full">
      <h3>
        <strong>
          Select Vendor
        </strong>
      </h3>
      {selectedVendor ? (
        <div
          className="border border-black rounded-xl p-5 w-full flex items-center justify-between"
        >
          <p>
            Selected Vendor: {selectedVendor.business?.businessName || selectedVendor.email}
          </p>
          <input type="hidden" name="vendorId" value={selectedVendor._id} readOnly />
          <IoIosCloseCircleOutline
            className="w-10 h-10 cursor-pointer"
            onClick={() => {
              setInputText('')
              router.push(`?businessCategory=`, {
                scroll: false,
              })
              setSelectedVendor(null)
            }


            } />
        </div>
      ) : (
        <label htmlFor="" className="relative">
          {selectedVendor ? (
            <div>
              {selectedVendor}
            </div>
          ) : (

            <input
              type="text"
              ref={inputRef}
              name="vendorSelected"
              value={inputText}
              onFocus={() => setInputFocused(true)}
              onBlur={() => {
                // Delay setting isInputFocused to false
                setTimeout(() => setInputFocused(false), 200);
              }}
              onChange={e => {
                setInputFocused(true)
                setInputText(e.currentTarget.value)
              }}
              onClick={() => setInputFocused(true)}
              className="border border-black rounded-xl p-5 w-full"
            />
          )}
          {isInputFocused && filteredVendors.length >= 1 && (
            <ul className={`flex flex-col gap-2 border max-h-[400px] hide-scrollbar overflow-y-scroll bg-white z-20 border-black rounded-xl py-5 absolute w-full`}>
              {filteredVendors.map(vendor => (
                <li key={vendor.email} className="flex justify-between hover:bg-slate-200 w-full px-5"
                  onMouseDown={() => {
                    setSelectedVendor(vendor);
                    setInputText(vendor.business?.businessName || vendor.email); // Update the input text
                    setInputFocused(false);
                    router.push(`?businessCategory=${vendor.business?.industry}&selectedVendor=${vendor._id}`, {
                      scroll: false,
                    })
                  }}
                >
                  <span>
                    {vendor.business?.businessName || vendor.email}
                  </span>
                  <span>
                    Category: {vendor.business?.industry}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </label>
      )
      }

      {selectedVendor && (
        <Link href={`/admin/dashboard/vendors/${selectedVendor._id}`} target="_blank">
          <span className="text-blue-600 underline">
            View Vendor Profile
          </span>
        </Link>
      )}
    </section >
  );
}

export default SelectVendor;