"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const StatusFilter = ({statuses, filterName}: {
  statuses: string[];
  filterName: string;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target
    const params = new URLSearchParams(searchParams.toString())
    params.set(filterName, value)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <select onChange={handleFilter} className="w-fit border border-black rounded-full px-2 py-1 flex items-center capitalize">
      {statuses.map((status) => (
        <option key={status} value={status}>{status}</option>
      ))}
      <option value="all">All</option>
    </select>
  );
}

export default StatusFilter;