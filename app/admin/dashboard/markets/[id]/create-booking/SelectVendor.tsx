"use client";
import { TVendor } from "@/sanity/queries/admin/vendors";
import { useState } from "react";
import { CloseCircleIcon } from '@sanity/icons'

const SelectVendor = ({ allVendors }: {
  allVendors: TVendor[];
}) => {
  const [inputText, setInputText] = useState("")
  const [selectedVendor, setSelectedVendor] = useState<TVendor | null>(null)

  const filteredVendors = allVendors.filter(vendor => vendor.business?.name.toLowerCase().includes(inputText.toLowerCase()) || vendor.email.toLowerCase().includes(inputText.toLowerCase()) || vendor.firstName.toLowerCase().includes(inputText.toLowerCase()) || vendor.lastName.toLowerCase().includes(inputText.toLowerCase()))

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
          <CloseCircleIcon className="w-10 h-10 cursor-pointer" onClick={() => setSelectedVendor(null)} />
        </div>
      ) : (
        <label htmlFor="" className="relative">

          <input
            type="text"
            name="vendorSelected"
            value={inputText}
            onChange={e => setInputText(e.currentTarget.value)}
            className="border border-black rounded-xl p-5 w-full"
          />
          {inputText.length > 1 && filteredVendors.length > 0 && (
            <ul className="flex flex-col gap-2 border border-black rounded-xl py-5 absolute w-full">
              {inputText.length > 0 && filteredVendors.map(vendor => (
                <li key={vendor.email} className="flex justify-between hover:bg-slate-200 w-full px-5 cursor-pointer"
                  onClick={() => setSelectedVendor(vendor)}
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
      )}
    </section>
  );
}

export default SelectVendor;