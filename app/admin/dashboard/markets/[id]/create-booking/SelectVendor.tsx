"use client";
import { TVendor } from "@/sanity/queries/admin/vendors";
import { useRef, useState } from "react";
import { CloseCircleIcon } from '@sanity/icons'
import { useClickOutside, useEscapeKey } from "@/app/_components/hooks";
import { useRouter } from "next/navigation";

const SelectVendor = ({ allVendors }: {
  allVendors: TVendor[];
}) => {
  const [inputText, setInputText] = useState("")
  const [selectedVendor, setSelectedVendor] = useState<TVendor | null>(null)
  const [isInputFocused, setInputFocused] = useState(false);
  const inputRef = useRef(null);
  const router = useRouter()

  const filteredVendors = allVendors.filter(vendor => {
    if (inputText.trim() === '') {
      return true;
    }

    return (
      vendor.business?.name.toLowerCase().includes(inputText.toLowerCase()) ||
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
            Selected Vendor: {selectedVendor.business?.name || selectedVendor.email}
          </p>
          <input type="hidden" name="vendorId" value={selectedVendor._id} readOnly />
          <CloseCircleIcon 
          className="w-10 h-10 cursor-pointer" 
          onClick={() => {
            setInputText('')
            router.push(`?businessCategory=`)
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
                    setInputText(vendor.business?.name || vendor.email); // Update the input text
                    setInputFocused(false);
                    router.push(`?businessCategory=${vendor.business?.category}`)
                  }}
                >
                  <span>
                    {vendor.business?.name || vendor.email}
                  </span>
                  <span>
                    Category: {vendor.business?.category}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </label>
      )
      }
    </section >
  );
}

export default SelectVendor;