import UserManagementTableRow from "./UserManagementTableRow";

const Table = ({ columns, data }) => {
  const gridCols = columns.length;

  // Define grid classes based on column count
  const getGridClass = (colCount) => {
    switch (colCount) {
      case 7:
        return "grid-cols-8";
      case 9:
        return "grid-cols-10";
      case 10:
        return "grid-cols-10";
      default:
        return `grid-cols-${colCount}`;
    }
  };

  return (
    <main className="overflow-x-auto">
      <section className="min-w-[1200px] w-full bg-transparent rounded-lg shadow-md space-y-3">
        {/* Header section */}
        <div
          className={`grid ${getGridClass(
            gridCols
          )} text-center border-2 border-opacity-50 rounded-lg justify-items-stretch bg-surfacePrimary border-primary`}
        >
          {columns.map((column, index) => (
            <div key={index} className="py-3 text-sm font-semibold">
              {column}
            </div>
          ))}
        </div>

        {/* Body section */}
        <div className="border-2 border-opacity-50 rounded-lg bg-surfacePrimary border-primary">
          {data.length > 0 ? (
            data.map((user, i) => (
              <UserManagementTableRow
                key={user._id}
                user={user}
                columns={columns}
                list={i + 1}
              />
            ))
          ) : (
            <div className="py-8 text-center">No users found</div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Table;
