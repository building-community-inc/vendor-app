"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const GeneralFilters = () => {
  const filterCheckboxNames = ["select-balances", "select-history", "all"];

  return (
    <div className="flex gap-4">
      <Checkbox checkboxName="select-balances" label="Outstanding Balances" groupNames={filterCheckboxNames} />
      <Checkbox checkboxName="select-history" label="Payment History" groupNames={filterCheckboxNames} />
      <Checkbox checkboxName="all" label="All" groupNames={filterCheckboxNames} />
    </div>
  );
}

export default GeneralFilters;

const Checkbox = ({ checkboxName, label, groupNames }: {
  label: string;
  checkboxName: string;
  groupNames: string[];
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecked, setIsChecked] = useState(() => {
    if (checkboxName === 'all') {
      // For "All" checkbox, initially checked if no filter params are present
      return !groupNames.some(name => name !== 'all' && searchParams.has(name));
    } else {
      return searchParams.get(checkboxName) !== null; // Initial state from URL params for other checkboxes
    }
  });

  useEffect(() => {
    // Sync isChecked with searchParams on URL changes
    const paramValue = searchParams.get(checkboxName);
    if (checkboxName === 'all') {
      // For "All" checkbox, checked if no other filter params are present
      setIsChecked(!groupNames.some(name => name !== 'all' && searchParams.has(name)));
    } else {
      setIsChecked(paramValue !== null); // For other checkboxes, just check if their param is present
    }
  }, [searchParams, checkboxName, groupNames]); // Added groupNames to dependencies


  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsChecked(checked); // Update local checked state immediately

    const params = new URLSearchParams(searchParams.toString());

    if (checkboxName === 'all') {
      if (checked) {
        // If "All" is checked, remove ALL filter parameters
        groupNames.forEach(name => params.delete(name)); // Delete all params in the group
      } else {
        // If "All" is unchecked, you might want to set a default filter or do nothing.
        // For now, doing nothing (no params set) seems reasonable if "All" is meant to be default.
        params.delete('all'); // Just in case 'all' param was somehow present even when unchecked
      }
    } else { // For other checkboxes ("select-balances", "select-history")
      if (checked) {
        // If checking a specific filter, clear "all" and other filters in the group
        groupNames.forEach(name => {
          if (name !== checkboxName) {
            params.delete(name);
          }
        });
        params.set(checkboxName, "true");
      } else {
        // If unchecking a specific filter, remove its param
        params.delete(checkboxName);
        // Check if no other filters are active, then maybe set "all"
        if (!groupNames.some(name => name !== 'all' && params.has(name))) {
          // If no other filters are active, visually select "All" (handled by useEffect sync)
          params.delete('all'); // Ensure 'all' is not in params if specific filters are used, even if visually 'all' might appear selected after unchecking last specific filter, best to be explicit
        }
      }
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <label htmlFor={checkboxName} className="flex items-center gap-1">
      <input
        id={checkboxName}
        type="checkbox"
        name={checkboxName}
        checked={isChecked}
        onChange={handleFilter}
      />
      <span>
        {label}
      </span>
    </label>
  );
};