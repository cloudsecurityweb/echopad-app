import { useEffect, useState } from "react";
import { fetchClients } from "../api/clients.api";

export function useClients() {
  const [clients, setClients] = useState([]);

  useEffect(() => {

    fetchClients().then(res => {
      setClients(res.data?.data?.clients?.items || []);
    });
  }, []);

  return { clients };
}
