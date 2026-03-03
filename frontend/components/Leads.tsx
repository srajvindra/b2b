import React from "react";

const Leads: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Leads</h2>
          <p className="text-sm text-gray-500">
            Track new, in-progress, and converted leads.
          </p>
        </div>

        <button className="px-3 py-2 rounded-md border text-sm">
          + Add New Lead
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border rounded-lg p-3">
          <p className="text-xs text-gray-500">New Leads</p>
          <p className="text-2xl font-semibold mt-1">36</p>
          <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
        </div>
        <div className="border rounded-lg p-3">
          <p className="text-xs text-gray-500">In Progress</p>
          <p className="text-2xl font-semibold mt-1">22</p>
          <p className="text-xs text-gray-500 mt-1">Assigned to team</p>
        </div>
        <div className="border rounded-lg p-3">
          <p className="text-xs text-gray-500">Converted</p>
          <p className="text-2xl font-semibold mt-1">14</p>
          <p className="text-xs text-gray-500 mt-1">This month</p>
        </div>
        <div className="border rounded-lg p-3">
          <p className="text-xs text-gray-500">Lost</p>
          <p className="text-2xl font-semibold mt-1">5</p>
          <p className="text-xs text-gray-500 mt-1">Needs follow-up</p>
        </div>
      </div>

      {/* Leads list / table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <p className="text-sm font-medium">Recent Leads</p>
          <input
            type="text"
            placeholder="Search leads…"
            className="border rounded-md px-2 py-1 text-xs w-40"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-xs text-gray-500">
                  Name
                </th>
                <th className="px-4 py-2 text-left font-medium text-xs text-gray-500">
                  Source
                </th>
                <th className="px-4 py-2 text-left font-medium text-xs text-gray-500">
                  Status
                </th>
                <th className="px-4 py-2 text-left font-medium text-xs text-gray-500">
                  Created
                </th>
                <th className="px-4 py-2 text-left font-medium text-xs text-gray-500">
                  Owner
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-2">John Smith</td>
                <td className="px-4 py-2">Website form</td>
                <td className="px-4 py-2">
                  <span className="px-2 py-1 rounded-full text-xs border">
                    New
                  </span>
                </td>
                <td className="px-4 py-2">Nov 10, 2025</td>
                <td className="px-4 py-2">Alex Johnson</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">Emily Davis</td>
                <td className="px-4 py-2">Referral</td>
                <td className="px-4 py-2">
                  <span className="px-2 py-1 rounded-full text-xs border">
                    In Progress
                  </span>
                </td>
                <td className="px-4 py-2">Nov 9, 2025</td>
                <td className="px-4 py-2">Michael Lee</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">Acme Holdings</td>
                <td className="px-4 py-2">Cold outreach</td>
                <td className="px-4 py-2">
                  <span className="px-2 py-1 rounded-full text-xs border">
                    Converted
                  </span>
                </td>
                <td className="px-4 py-2">Nov 8, 2025</td>
                <td className="px-4 py-2">Priya Patel</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leads;
