"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const StatusFilter = ({ statuses, filterName }: {
  statuses: string[];
  filterName: string;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedValue, setSelectedValue] = useState(() => {
    return searchParams.get(filterName) || 'all'; // Initialize selectedValue from searchParams or default to 'all'
  });

  useEffect(() => {
    // Sync selectedValue with searchParams on URL changes
    const paramValue = searchParams.get(filterName);
    setSelectedValue(paramValue || 'all'); // Update selectedValue when searchParams changes, default to 'all' if param is not present
  }, [searchParams, filterName]); // React to changes in searchParams and filterName

  const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setSelectedValue(value); // Update local selectedValue state immediately

    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') {
      params.delete(filterName); // Remove filter param if 'all' is selected
    } else {
      params.set(filterName, value); // Set filter param with selected value
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <select
      onChange={handleFilter}
      className="w-fit border border-black rounded-full px-2 py-1 flex items-center capitalize"
      value={selectedValue} // Control the select value with state
    >
      {statuses.map((status) => (
        <option key={status} value={status}>{status}</option>
      ))}
      <option value="all">All</option>
    </select>
  );
}

export default StatusFilter;