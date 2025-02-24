"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useState } from "react";

const VendorFilters = ({ vendorStatuses }: {
  vendorStatuses: string[]
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const selectedStatus = searchParams.get("vendorStatus")

  const [status, setStatus] = useState(selectedStatus || "all")


  const onSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value
    const params = new URLSearchParams(searchParams.toString())
    if (newValue === "all") {
      params.delete("vendorStatus")
      setStatus(newValue)
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    } else {
      params.set("vendorStatus", newValue);
      setStatus(newValue)
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }


  };
  return (
    <select value={status} onChange={onSelect} className="w-fit border border-black rounded-full px-2 py-1 capitalize">
      {vendorStatuses.map(status => (
        <option value={status}>{status}</option>
      ))}
      <option value="all">All</option>
    </select>
  );
}

export default VendorFilters;