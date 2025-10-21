import TableBody from './TableBody';

const TableHead = ({ columns, data }) => {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1400px] w-full bg-transparent rounded-lg shadow-md space-y-3">
        {/* Header */}
        <div className="grid grid-cols-8 text-center border-2 border-opacity-50 rounded-lg bg-surfacePrimary border-primary">
          {columns.map((column, index) => (
            <div key={index} className="py-3 font-semibold text-center text-gray-700">
              {column}
            </div>
          ))}
        </div>

        {/* Table Body */}
        <div className="border-2 border-opacity-50 rounded-lg bg-surfacePrimary border-primary">
          {data.length > 0 ? (
            data.map((item, i) => (
              <TableBody item={item} key={item._id} list={i + 1} />
            ))
          ) : (
            <div className="py-4 text-center text-gray-500">No contact data found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableHead;