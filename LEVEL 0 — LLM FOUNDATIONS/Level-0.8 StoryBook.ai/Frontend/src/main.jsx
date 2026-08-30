import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App/App.jsx'
import { RouterProvider } from 'react-router-dom'
import { appRouter } from './App/app.routes.jsx'
import store from '../src/App/app.store.js'
import { Provider } from 'react-redux'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={appRouter}  >
        <App />
      </RouterProvider>
    </Provider>
  </StrictMode>,
)
