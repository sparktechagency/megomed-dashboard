import React, { useState } from "react";
import OfferReviewTableRow from "./OfferReviewTableRow";
import { useBussinessShopOfferQuery } from "../features/bussinessManagement/bussinessApi";

const OfferReviewTable = ({ columns }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError } = useBussinessShopOfferQuery(currentPage);

  const totalPages = data?.data?.pagination?.totalPage || 1;
  const totalItems = data?.data?.pagination?.total || 0;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1200px] w-full bg-transparent rounded-lg shadow-md space-y-3">
        {/* Header section */}
        <div className="grid grid-cols-8 border-2 border-opacity-50 rounded-lg text-start justify-items-stretch bg-surfacePrimary border-primary">
          {columns.map((column, index) => (
            <div key={index} className="py-3 text-center">
              {column}
            </div>
          ))}
        </div>

        {/* Body section */}
        <div className="border-2 border-opacity-50 rounded-lg bg-surfacePrimary border-primary">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-16 h-16 border-t-4 border-b-4 rounded-full border-primary animate-spin"></div>
            </div>
          ) : isError ? (
            <h3 className="py-10 text-center text-red-600">Error loading data</h3>
          ) : data?.data?.shops?.length > 0 ? (
            data.data.shops.map((item, i) => <OfferReviewTableRow item={item} key={i} num ={i+1} />)
          ) : (
            <h3 className="py-10 text-center">No Data Available</h3>
          )}
        </div>

        {/* Pagination section */}
        <div className="flex items-center justify-end py-4 space-x-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-white transition-colors rounded-lg shadow-md bg-primary hover:bg-primary disabled:bg-primary"
          >
            &lt; 
          </button>
          <span className="font-semibold text-gray-700">
            {`Page ${currentPage} of ${totalPages}`}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-white transition-colors rounded-lg shadow-md bg-primary hover:bg-primary disabled:bg-primary"
          >
           &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferReviewTable;
