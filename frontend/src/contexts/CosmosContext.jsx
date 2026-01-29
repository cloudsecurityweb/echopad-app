import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initializeCosmosDB, testConnection, getClient, getDatabase, getContainer, isCosmosDBInitialized } from '../utils/cosmos';

const CosmosContext = createContext(null);

export function CosmosProvider({ children }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState(null);
  const [client, setClient] = useState(null);
  const [database, setDatabase] = useState(null);
  const [container, setContainer] = useState(null);

  // Initialize Cosmos DB connection on mount
  useEffect(() => {
    const initConnection = async () => {
      try {
        setIsConnecting(true);
        setConnectionError(null);

        // Initialize Cosmos DB
        const { client: cosmosClient, database: cosmosDatabase, container: cosmosContainer, error } = initializeCosmosDB();

        if (error) {
          console.warn('Cosmos DB initialization warning:', error.message);
          setConnectionError(error);
          setClient(null);
          setDatabase(null);
          setContainer(null);
          setIsInitialized(false);
          return;
        }

        if (cosmosClient && cosmosDatabase && cosmosContainer) {
          setClient(cosmosClient);
          setDatabase(cosmosDatabase);
          setContainer(cosmosContainer);
          setIsInitialized(true);
          setConnectionError(null);
          console.log(' Cosmos DB initialized successfully');
        } else {
          setIsInitialized(false);
          setConnectionError(new Error('Failed to initialize Cosmos DB client'));
        }
      } catch (error) {
        console.error(' Cosmos DB initialization error:', error);
        setConnectionError(error);
        setIsInitialized(false);
        setClient(null);
        setDatabase(null);
        setContainer(null);
      } finally {
        setIsConnecting(false);
      }
    };

    initConnection();
  }, []);

  // Reconnect function
  const reconnect = useCallback(async () => {
    setIsConnecting(true);
    setConnectionError(null);

    try {
      const { client: cosmosClient, database: cosmosDatabase, container: cosmosContainer, error } = initializeCosmosDB();

      if (error) {
        setConnectionError(error);
        setClient(null);
        setDatabase(null);
        setContainer(null);
        setIsInitialized(false);
        return false;
      }

      if (cosmosClient && cosmosDatabase && cosmosContainer) {
        setClient(cosmosClient);
        setDatabase(cosmosDatabase);
        setContainer(cosmosContainer);
        setIsInitialized(true);

        const connectionTest = await testConnection();
        if (connectionTest) {
          setConnectionError(null);
          return true;
        } else {
          setConnectionError(new Error('Connection test failed'));
          return false;
        }
      }

      return false;
    } catch (error) {
      console.error('Reconnection error:', error);
      setConnectionError(error);
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Test connection function
  const test = useCallback(async () => {
    if (!isInitialized) {
      return false;
    }
    return await testConnection();
  }, [isInitialized]);

  const value = {
    // Connection state
    isInitialized,
    isConnecting,
    connectionError,
    isConnected: isInitialized && !connectionError,

    // Cosmos DB instances
    client,
    database,
    container,

    // Helper functions
    reconnect,
    test,
  };

  return (
    <CosmosContext.Provider value={value}>
      {children}
    </CosmosContext.Provider>
  );
}

export function useCosmos() {
  const context = useContext(CosmosContext);
  if (!context) {
    throw new Error('useCosmos must be used within a CosmosProvider');
  }
  return context;
}
