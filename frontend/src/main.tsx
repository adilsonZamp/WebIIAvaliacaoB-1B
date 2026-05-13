import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import router from './routes'
import { RouterProvider } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* providers dos contextos necessários */}
    <RouterProvider router={router} />
  </StrictMode>,
)
