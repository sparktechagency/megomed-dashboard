import React from 'react';
import { useGetAllOfferQuery } from '../features/offer/offerApi';
import TableRow from "../components/TableRow";
import CustomLoading from './CustomLoading';

const Table = ({ columns, data , location, noData }) => {
  const { data: offers, isLoading, error } = useGetAllOfferQuery();

  
  

if (isLoading) return <CustomLoading/>;
if (error) return <p>Server Error</p>;

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1200px] w-full bg-transparent rounded-lg shadow-md space-y-3">
        {/* Header section */}
        <div className={`grid ${location === "/order" ? "grid-cols-10" : "grid-cols-10"} ${location === "/offer" ? "grid-cols-11" : "grid-cols-10"}   ${location === "/earning" ? "grid-cols-10" : "grid-cols-10"} border-2 px-3 text-start border-opacity-50 rounded-lg bg-surfacePrimary border-primary`}>
        {columns.map((column, index) => (
  <div key={index} className={`py-3 text-start pl-3 
    ${column === "Category" || column === "Offer Type" ? "-ml-1" : ""} 
    ${(column === "Start Date" || column === "End Date") && location === "/order" ? "-ml-2.5" : "-ml-0"} 
     ${column === "Price" ? location === '/order' && "flex justify-center -ml-1":""}
     ${column === "Order Number" ? location === '/order' && "flex justify-center -ml-[90px]":""}
     ${column === "User Name" ? location === '/order' && "flex justify-center -ml-[130px]":""}
     ${column === "Location" ? location === '/order' && "flex justify-center -ml-[90px]":""}
     ${column === "Item & Qty" ? location === '/order' && "flex justify-center -ml-[150px]":""}
     ${column === "Offer" ? location === '/order' && "flex justify-center -ml-[150px]":""}
    ${column === "Status" ? location === '/order' && "flex justify-center":""}
    ${column === "Action" ? location === '/offer' && "text-center ml-[80px]" || location === '/earning' && "text-center ml-[35px]" : ""} 
   `}
  >
    {column}
  </div>
))}

        </div>
        {/* Body section */}
                <div className="border-2 border-opacity-50 rounded-lg bg-surfacePrimary border-primary">
          {location === "/order" ? (
           data?.length === 0 || data === undefined  ? <h3 className='py-10 text-center'>No Data Available</h3>:  data?.map((item, i) => <TableRow key={i} location={location} list={i} item={item} />)
          ) : location === "/earning" ? (
            data?.length === 0 || data===undefined  ? <h3 className='py-10 text-center'>No Data Available</h3>: data?.map((item, i) => <TableRow key={i} location={location} list={i} item={item} />)
          ) : (
            data?.length === 0 || data === undefined  ? <h3 className='py-10 text-center'>No Data Available</h3>: offers?.data?.map((item, i) => <TableRow key={i} location={location} list={i} item={item} />)
          )}
        </div>

      </div>
    </div>
  );
};

export default Table;