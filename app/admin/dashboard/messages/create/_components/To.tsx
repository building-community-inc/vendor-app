"use client";
import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useClickOutside, useEscapeKey } from "@/app/_components/hooks";
import { debounce } from "@/utils/helpers";
import { Input } from "./CreateMessageForm";
import { TUserWithOptionalBusinessRef } from "@/zod/user-business";
import { FaTrash } from "react-icons/fa";

const To = ({ vendorList }: {
  vendorList: TUserWithOptionalBusinessRef[];
}) => {
  const [focused, setFocused] = useState(false);
  const search = useSearchParams().get("search");
  const [value, setValue] = useState("")
  const { push } = useRouter();
  const vendorListRef = useRef(null);

  const [selectedVendors, setSelectedVendors] = useState<TUserWithOptionalBusinessRef[]>([]);

  const debouncedPush = debounce((value: string) => {
    push(`?search=${value}`);
  }, 300);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFocused(true)
    setValue(value);
    debouncedPush(value);
  };


  const filterVendors = (arrayVendors: TUserWithOptionalBusinessRef[]) => arrayVendors.filter((vendor) => {
    if (!search) {
      return true;
    }

    const vendorBusinessName = vendor.business?.businessName.toLowerCase() || "No Business";

    return vendorBusinessName.toLowerCase().includes(search) || vendor.email.toLowerCase().includes(search) || vendor.firstName.toLowerCase().includes(search) || vendor.lastName.toLowerCase().includes(search)
  });


  useClickOutside(vendorListRef, () => {
    setFocused(false)
  })

  useEscapeKey(() => {
    setFocused(false)
  })

  const toId = vendorList.find(vendor => vendor.email === value)?._id || "";

  const handleCheckboxChange = (vendor: TUserWithOptionalBusinessRef) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedVendors(prevVendors => {
        // Check if the vendor is already in the selectedVendors array
        if (!prevVendors.some(v => v._id === vendor._id)) {
          // If the vendor is not in the array, add it
          return [...prevVendors, vendor];
        } else {
          // If the vendor is already in the array, return the array unchanged
          return prevVendors;
        }
      });
    } else {
      setSelectedVendors(prevVendors => prevVendors.filter(v => v._id !== vendor._id));
    }
  };

  return (
    <div className="relative">
      <Input
        label="Search"
        name="to"
        onFocus={() => setFocused(true)}
        value={value}
        onChange={handleSearch}

      />
      {selectedVendors.length > 0 && (
        <ul>
          <strong>Sending Message To:</strong>
          {selectedVendors.map(vendor => (
            <li key={vendor._id} className="flex items-center gap-2">
              {vendor.email}
              <input type="text" hidden readOnly name="vendorId" value={vendor._id} />
              <FaTrash className="cursor-pointer" onClick={() => {
                setSelectedVendors(prevVendors => prevVendors.filter(v => v._id !== vendor._id))
              }} />
            </li>
          ))}
        </ul>
      )}
      <input type="hidden" name="to_id" value={toId} />
      {focused && (
        <ul ref={vendorListRef} className="absolute top-full bg-white border rounded-lg overflow-scroll max-h-[500px] border-[#707070] mt-1 w-full">
          {filterVendors(vendorList).map((vendor) => (
            <li key={vendor._id} onClick={() => {
              const isChecked = selectedVendors.some(selectedVendor => selectedVendor._id === vendor._id);
              handleCheckboxChange(vendor)({ target: { checked: !isChecked } } as any)
            }}
              className="py-2 px-2 hover:bg-[#F7F7F7] flex flex-col"
            >
              <p className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="vendorSelected"
                  onChange={handleCheckboxChange(vendor)}
                  checked={selectedVendors.some(selectedVendor => selectedVendor._id === vendor._id)}
                />
                {vendor.email}
              </p>
              <div className="flex text-xs gap-2">
                {vendor.business ? (

                  <span className="flex gap-2">
                    <strong>
                      Business Name:
                    </strong>
                    {vendor.business?.businessName}
                  </span>
                ) : (
                  <span>
                    <strong>
                      No Business Info
                    </strong>
                  </span>
                )}
                <span className="flex gap-2">
                  <strong>
                    Contact Name:
                  </strong>
                  {vendor.firstName} {vendor.lastName}
                </span>
              </div>

            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default To;