import { Select } from 'antd';
import { useState } from 'react';
import { useGetAllCheckVerifyUsersQuery } from '../../features/verifyRequest/VerifyRequestApi';
import VerifyRequestTableHead from './VerifyRequestTableHead';

const { Option } = Select;

const columns = [
  "SL",
  "User Name",
  "Email",
  "Role",
  "Designation",
  "Location",
  "Experience",
  "Daily Rate",
  "Verification Status",
  "Registration Date",
  "Action",
];

const VerifyRequestManagement = () => {
  const { data, isLoading, error } = useGetAllCheckVerifyUsersQuery();
  const [statusFilter, setStatusFilter] = useState('all');

  console.log('Users Data:', data?.data);
  console.log('Meta Data:', data?.meta);

  // Filter data - শুধুমাত্র verified_request এবং revision দেখাবে
  const filteredData = data?.data ? data.data.filter(user => {
    // প্রথমে verified_request এবং revision চেক করুন
    const isAllowedStatus = user.isVarified === 'verified_request' || user.isVarified === 'revision';

    if (!isAllowedStatus) return false;

    // তারপর স্ট্যাটাস ফিল্টার চেক করুন
    const statusMatch = statusFilter === 'all' || user.isVarified === statusFilter;

    return statusMatch;
  }) : [];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
     

      {/* Filters */}
      <div className="py-6">
        <div className="flex justify-between items-center">
           <div className="">
        <h1 className="text-2xl font-bold text-gray-800">Verification Requests Management</h1>
        <p className="text-gray-600">Manage and verify user accounts</p>
      </div>
          <div className="w-3/12">

            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              className="w-full"
              placeholder="Filter by status"
            >
              <Option value="all">All Status</Option>
              <Option value="verified_request">Verified Request</Option>
              <Option value="revision">Revision</Option>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-gray-600">Loading users...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Error loading data: {error?.message || "Unknown error"}
          </div>
        ) : filteredData.length > 0 ? (
          <VerifyRequestTableHead
            columns={columns}
            data={filteredData}
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            No users found matching your filters
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyRequestManagement;