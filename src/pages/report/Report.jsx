import { useGetAllReportQuery } from '../../features/report/ReportApi';
import ReportTableHead from './ReportTableHead';

const columns = [
  "SL",
  "Reported By",
  "Report Text",
  "Report Date",
];

const Report = () => {
  const { data, isLoading, error } = useGetAllReportQuery();

  console.log('Report Data:', data?.data);
  console.log('Meta Data:', data?.meta);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reports Management</h1>
        <p className="text-gray-600">Manage and view all user reports</p>
      </div>
      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-gray-600">Loading reports...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Error loading data: {error?.message || "Unknown error"}
          </div>
        ) : data?.data && data.data.length > 0 ? (
          <ReportTableHead
            columns={columns}
            data={data.data}
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            No reports found
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;