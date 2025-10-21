import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useBussinessAllShopQuery } from "../features/bussinessManagement/bussinessApi";
import CustomLoading from "./CustomLoading";
import { useLocation, useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import io from "socket.io-client";
import { baseURL } from "../utils/BaseURL";
import ParkingManagementTableRow from "./ParkingManagementTableRow";
import StatusFilter from "./StatusFilter";


const parkingData = [
  {
    id:1,
    SpotName:"Easy Park Spot ",
    status:"Active",
    email: "example@email.com",
    location:"Demo Location",
    phone:"12345-678901",
    Total_Parking:"5000",
    Revenue:"10"
  },
  {
    id:2,
    SpotName:"Easy Park Spot ",
    status:"Active",
    email: "example@email.com",
    location:"Demo Location",
    phone:"12345-678901",
    Total_Parking:"5000",
    Revenue:"10"
  },
  {
    id:3,
    SpotName:"Easy Park Spot ",
    email: "example@email.com",
    status:"Active",
    location:"Demo Location",
    phone:"12345-678901",
    Total_Parking:"5000",
    Revenue:"10"
  },
  {
    id:4,
    SpotName:"Easy Park Spot ",
    email: "example@email.com",
    status:"Active",
    location:"Demo Location",
    phone:"12345-678901",
    Total_Parking:"5000",
    Revenue:"10"
  },
]

// Initialize socket connection - replace with your actual backend URL
const socket = io(baseURL);
const ParkingManagementTable = ({ columns }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const pageParam = parseInt(queryParams.get("page")) || 1;

  const [currentPage, setCurrentPage] = useState(pageParam);
  const [isFetching, setIsFetching] = useState(false);

  const { data, isLoading, refetch } = useBussinessAllShopQuery(currentPage);

  const totalPage = data?.pagination?.totalPage || 1;

  // Debounce function to prevent excessive re-renders
  const updatePage = useCallback(
    debounce((page) => {
      navigate(`?page=${page}`, { replace: true });
      setIsFetching(false);
    }, 300),
    [navigate]
  );

  useEffect(() => {
    setIsFetching(true);
    updatePage(currentPage);
  }, [currentPage, updatePage]);

  const filteredOrders = useMemo(() => data?.data || [], [data?.data]);

  // Generate Pagination Buttons with Ellipsis
  const getPageNumbers = () => {
    if (totalPage <= 5) return Array.from({ length: totalPage }, (_, i) => i + 1);

    if (currentPage <= 3) return [1, 2, 3, "...", totalPage];
    if (currentPage >= totalPage - 2) return [1, "...", totalPage - 2, totalPage - 1, totalPage];

    return [1, "...", currentPage, "...", totalPage];
  };
// Socket event listeners for real-time updates
useEffect(() => {
  // Listen for shop updates (create, update, delete)
  socket.on( `notification::${localStorage.getItem("adminLoginId")}`, (data) => {
    refetch();
  });
  return () => {
    socket.off(`notification::${localStorage.getItem("adminLoginId")}`);
  };
}, [refetch]);

const customStatusOptions = [
  { value: 'Active' },
  { value: 'Block'},
];

const handleStatusChange = (status) => {
  console.log('Selected status:', status);
};

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1200px] w-full bg-transparent rounded-lg shadow-md space-y-3">

      <div className="flex justify-end">
      {/* Use the pre-configured StatusFilter */}

      {/* Create a custom filter */}

      <StatusFilter 
        options={customStatusOptions}
        defaultValue="Active"
        onChange={handleStatusChange}
        placeholder="Status Filter"
        style={{ width: 200 }}
      />
    

    </div>

        {/* Header section */}
        <div className="grid grid-cols-9 text-center border-2 border-opacity-50 rounded-lg bg-surfacePrimary border-primary">
          {columns.map((column, index) => (
            <div key={index} className="py-3 font-semibold text-center">
              {column}
            </div>
          ))}
          <div className="col-span-2 py-3 font-semibold">Action</div>
        </div>

        {/* Body section */}
        <div className="border-2 border-opacity-50 rounded-lg bg-surfacePrimary border-primary">
          {isLoading || isFetching ? (
            <CustomLoading />
          ) : parkingData.length > 0 ? (
            parkingData.map((item, i) => (
              <ParkingManagementTableRow item={item} key={i} list={i + 1} />
            ))
          ) : (
            <h3 className="py-10 text-center">No Data Available</h3>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-end mt-4">
          {/* First Page Button */}
          <button
            className={`px-4 py-2 mx-1 border rounded ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`}
            disabled={currentPage === 1 || isFetching}
            onClick={() => setCurrentPage(1)}
          >
            First
          </button>

          {/* Previous Button */}
          <button
            className={`px-4 py-2 mx-1 border rounded ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`}
            disabled={currentPage === 1 || isFetching}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Prev
          </button>

          {/* Page Numbers with Ellipsis */}
          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span key={index} className="px-4 py-2 mx-1">...</span>
            ) : (
              <button
                key={index}
                className={`px-4 py-2 mx-1 border rounded ${
                  currentPage === page ? "bg-primary text-white" : "hover:bg-gray-200"
                } ${isFetching ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => !isFetching && setCurrentPage(page)}
              >
                {page}
              </button>
            )
          )}

          {/* Next Button */}
          <button
            className={`px-4 py-2 mx-1 border rounded ${currentPage === totalPage ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`}
            disabled={currentPage === totalPage || isFetching}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPage))}
          >
            Next
          </button>

          {/* Last Page Button */}
          <button
            className={`px-4 py-2 mx-1 border rounded ${currentPage === totalPage ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`}
            disabled={currentPage === totalPage || isFetching}
            onClick={() => setCurrentPage(totalPage)}>
            Last
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParkingManagementTable;
