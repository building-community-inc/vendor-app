"use client";
import { useState } from "react";
import { TMarketVendor } from "../page";

const AllVendors = ({
  vendors
}: {
  vendors?: TMarketVendor[] | null;
}) => {

  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  if (!vendors || vendors.length < 1) return null;

  const handleCopyEmails = () => {
    const emails = vendors.map(vendor => vendor.email).join(", ");
    navigator.clipboard.writeText(emails).then(() => {
      setCopySuccess("Emails copied to clipboard!");
      setTimeout(() => setCopySuccess(null), 2000);
    }).catch(err => {
      setCopySuccess("Failed to copy emails.");
      setTimeout(() => setCopySuccess(null), 2000);
    });
  };

  return (
    <section>
      <header className="flex justify-between items-center">
        <h3 className="font-bold text-lg">
          Vendors:
        </h3>
        <button
          onClick={handleCopyEmails}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Copy All Emails
        </button>
      </header>
      {copySuccess && <p>{copySuccess}</p>}
      <div className="w-full overflow-x-scroll">

        <table className="min-w-full divide-y divide-gray-200 max-w-[200px]">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Business Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Business Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Instagram
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vendors.map((vendor) => (
              <tr key={vendor._ref}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {vendor.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {vendor.businessName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {vendor.businessCategory}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {vendor.firstName} {vendor.lastName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {vendor.instagram}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AllVendors;