"use client";
import React from "react";

const AdminStatistics = ({
  totalUsers = 0,
  totalEarning = 0,
  totalFreelancer = 0,
  totalClient = 0,
  totalProjectAccepted = 0,
  totalProjectDelivered = 0,
}) => {
  return (
    <div className="border flex flex-col justify-center border-primary rounded-lg p-3">
      <div className="w-full rounded-xl flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Statistics</h2>
          <h3 className="border border-primary px-2 py-1.5 select-none rounded">
            Last 7 Days
          </h3>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="border border-primary w-full rounded-xl p-4">
              <div className="font-bold text-2xl mb-2">
                {totalUsers.toLocaleString()}
              </div>
              <div className="text-base font-medium text-gray-800">
                Total Users
              </div>
            </div>

            <div className="border border-primary w-full rounded-xl p-4">
              <div className="font-bold text-2xl mb-2">
                ${totalEarning.toLocaleString()}
              </div>
              <div className="text-base font-medium text-gray-800">
                Total Earning
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="border border-primary w-full rounded-xl p-4">
              <div className="font-bold text-2xl mb-2">
                {totalFreelancer.toLocaleString()}
              </div>
              <div className="text-base font-medium text-gray-800">
                Total Freelancer
              </div>
            </div>

            <div className="border border-primary w-full rounded-xl p-4">
              <div className="font-bold text-2xl mb-2">
                {totalClient.toLocaleString()}
              </div>
              <div className="text-base font-medium text-gray-800">
                Total Client
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="border border-primary w-full rounded-xl p-4">
              <div className="font-bold text-2xl mb-2">
                {totalProjectAccepted.toLocaleString()}
              </div>
              <div className="text-base font-medium text-gray-800">
                Total Project Accepted
              </div>
            </div>

            <div className="border border-primary w-full rounded-xl p-4">
              <div className="font-bold text-2xl mb-2">
                {totalProjectDelivered.toLocaleString()}
              </div>
              <div className="text-base font-medium text-gray-800">
                Total Project Delivered
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatistics;
