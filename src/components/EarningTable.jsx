import EarningTableRow from "./EarningTableRow";

const EarningTable = ({ columns, data }) => {
  console.log("///////", data);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1200px] w-full bg-transparent rounded-lg shadow-md space-y-3">
        {/* Header */}
        <div className="grid grid-cols-10 text-center border-2 border-opacity-50 rounded-lg bg-surfacePrimary border-primary">
          {columns.map((column, index) => (
            <div key={index} className="py-3 font-semibold text-center">
              {column}
            </div>
          ))}
        </div>

        {/* Table Body */}
        <div className="border-2 border-opacity-50 rounded-lg bg-surfacePrimary border-primary">
          {data.length > 0 ? (
            data.map((item, i) => (
              <EarningTableRow item={item} key={i} list={i + 1} />
            ))
          ) : (
            <div className="py-4 text-center">No earnings data found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EarningTable;
