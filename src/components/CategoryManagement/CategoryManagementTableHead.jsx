import React from "react";
import CategoryManagementTableBody from './CategoryManagementTableBody';
import { Spin } from 'antd';

const CategoryManagementTableHead = ({ columns, data, loading, refetch }) => {

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1200px] w-full bg-transparent rounded-lg shadow-md space-y-3">
        {/* Header */}
        <div className={`grid grid-cols-8 text-center border-2 border-opacity-50 rounded-lg bg-surfacePrimary px-2 border-primary`}>
          {columns.map((column) => (
            <div key={column} className="py-3 font-semibold text-center">
              {column}
            </div>
          ))}
        </div>

        {/* Table Body */}
        <div className="border-2 border-opacity-50 rounded-lg bg-surfacePrimary border-primary">
          {
            loading ? <h3 className="py-10 text-center"><Spin size='small' /></h3> : data?.length > 0 ? (
              data.map((item, index) => (
                <CategoryManagementTableBody item={item} key={item.id} list={index + 1} />
              ))
            ) : (
              <h3 className="py-10 text-center">No Data Available</h3>
            )}
        </div>
      </div>
    </div>
  );
};

export default CategoryManagementTableHead;
