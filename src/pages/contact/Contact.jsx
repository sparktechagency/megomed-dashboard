import { useGetContactQuery } from '../../features/Contact/ContactApi';
import TableHead from './TableHead';

const columns = [
  "SL",
  "Name",
  "Email",
  "Phone Number",
  "Message",
  "Status",
  "Date",
  "Actions"
];

const Contact = () => {
  const { data, isLoading, error } = useGetContactQuery();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Contact Management</h1>
        <p className="text-gray-600">Manage and view all contact form submissions</p>
      </div>
      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-gray-600">Loading contacts...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Error loading data: {error?.message || "Unknown error"}
          </div>
        ) : data?.data && data.data.length > 0 ? (
          <TableHead
            columns={columns}
            data={data.data}
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            No contact submissions found
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;