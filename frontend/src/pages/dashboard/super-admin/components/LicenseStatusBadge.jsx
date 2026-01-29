function LicenseStatusBadge({ status }) {
  const map = {
    INVITE_SENT: "bg-yellow-100 text-yellow-800",
    ACTIVE: "bg-green-100 text-green-800",
    INACTIVE: "bg-gray-100 text-gray-700",
    REVOKED: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        map[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

export default LicenseStatusBadge;
