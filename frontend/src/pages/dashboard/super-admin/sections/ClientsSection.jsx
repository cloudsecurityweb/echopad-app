import { useState } from "react";
import Section from "../components/Section";
import ClientsTable from "../components/ClientsTable";
import ClientDetailsModal from "../components/ClientDetailsModal";
import { useClients } from "../../../../hooks/useClients";
import AddClientModal from "../../../../components/clients/AddClientModal";

function ClientsSection() {
  const { clients } = useClients();
  const [selectedClient, setSelectedClient] = useState(null);
  const [search, setSearch] = useState("");
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const totalClients = clients?.length || 0;

  return (
    <Section
      title="Clients"
      subtitle="Manage organizations that have access to Echopad"
      action={
        <button
          onClick={() => setIsInviteOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium shadow hover:from-cyan-400 hover:to-blue-500 transition"
        >
          <i className="bi bi-person-plus-fill"></i>
          Invite Client
        </button>
      }
    >
      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Total Clients"
          value={totalClients}
          icon="bi-people-fill"
        />
        <StatCard
          label="Active Clients"
          value={totalClients} // placeholder
          icon="bi-check-circle-fill"
        />
        <StatCard
          label="Pending Invites"
          value={0}
          icon="bi-clock-history"
        />
      </div>

      {/* SEARCH + ACTIONS */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <input
          type="text"
          placeholder="Search clients by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:max-w-sm px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50">
            Export
          </button>
          <button className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50">
            Filters
          </button>
        </div>
      </div>

      {/* TABLE OR EMPTY STATE */}
      {clients && clients.length > 0 ? (
        <ClientsTable
          clients={clients}
          onViewDetails={(client) => {
            console.log("View client:", client.id);
            setSelectedClient(client);
          }}
        />
      ) : (
        <EmptyState onInvite={() => setIsInviteOpen(true)} />
      )}

      {/* CLIENT DETAILS MODAL */}
      {selectedClient && (
        <ClientDetailsModal
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
          onRevoke={() => {
            console.log("Revoke access for:", selectedClient.id);
            setSelectedClient(null);
          }}
        />
      )}

      {/* INVITE CLIENT MODAL */}
      <AddClientModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onSuccess={(invite) => {
          console.log("Invite sent:", invite);
          // future: refetch clients or show pending invite
        }}
      />
    </Section>
  );
}

/* ---------------- UI HELPERS ---------------- */

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white">
        <i className={`bi ${icon}`}></i>
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function EmptyState({ onInvite }) {
  return (
    <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl">
        <i className="bi bi-people"></i>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No clients yet
      </h3>
      <p className="text-gray-600 mb-6">
        Invite your first client to start managing access to Echopad.
      </p>
      <button
        onClick={onInvite}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium shadow hover:from-cyan-400 hover:to-blue-500 transition"
      >
        <i className="bi bi-person-plus-fill"></i>
        Invite Client
      </button>
    </div>
  );
}

export default ClientsSection;
