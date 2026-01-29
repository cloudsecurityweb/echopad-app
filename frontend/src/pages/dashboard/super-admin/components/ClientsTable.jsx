function ClientsTable({ clients, onViewDetails }) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="text-left px-4 py-3 text-sm font-semibold">
              Client
            </th>
            <th className="text-left px-4 py-3 text-sm font-semibold">
              Status
            </th>
            <th className="text-left px-4 py-3 text-sm font-semibold">
              Subscription
            </th>
            <th className="px-4 py-3" />
          </tr>
        </thead>

        <tbody>
          {clients.map(client => (
            <tr
              key={client.id}
              className="border-b last:border-0 hover:bg-gray-50"
            >
              <td className="px-4 py-4 font-medium text-gray-900">
                {client.name}
              </td>
              <td className="px-4 py-4 text-sm">
                <span className="px-2 py-1 rounded bg-green-100 text-green-700">
                  {client.status}
                </span>
              </td>
              <td className="px-4 py-4 text-sm text-gray-700">
                {client.subscriptionTier}
              </td>
              <td className="px-4 py-4 text-right">
                <button
                  onClick={() => onViewDetails(client)}
                  className="text-cyan-600 text-sm font-medium hover:underline"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClientsTable;
