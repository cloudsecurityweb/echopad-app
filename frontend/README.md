# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Environment Variables

### Cosmos DB Configuration

To connect to Azure Cosmos DB, create a `.env` file in the frontend directory with the following variable:

```
VITE_COSMOS_CONNECTION_STRING=your_cosmos_db_connection_string_here
```

**Important Security Note**: Variables prefixed with `VITE_` are exposed to the browser bundle. For production, consider using a backend API proxy to keep credentials secure.

Get your connection string from: Azure Portal → Your Cosmos DB Account → Keys

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
