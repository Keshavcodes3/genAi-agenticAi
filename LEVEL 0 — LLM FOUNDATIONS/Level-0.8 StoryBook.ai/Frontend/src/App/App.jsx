import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { appRouter } from './app.routes';

function App() {
  return (
    <RouterProvider router={appRouter} />
  );
}

export default App;