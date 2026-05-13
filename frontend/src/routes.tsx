import { createBrowserRouter, Navigate } from 'react-router-dom'
import Login from './pages/login'
import HomeCliente from './pages/home'
import HomeGerente from './pages/homeGerente'

const router = createBrowserRouter ([
    {
        path: '/',
        element: <Navigate to='/login' replace />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/home',
        element: <HomeCliente />
    },
    {
        path: 'gerente/home',
        element: <HomeGerente />
    },
    {
        path: '/home',
        element: <HomeCliente />
    }
])

export default router