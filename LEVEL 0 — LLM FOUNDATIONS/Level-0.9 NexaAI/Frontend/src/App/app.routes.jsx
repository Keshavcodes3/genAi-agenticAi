import { createBrowserRouter, Navigate } from 'react-router-dom';
import Register from '../Features/Authentication/Pages/Register.jsx';
import Login from '../Features/Authentication/Pages/Login.jsx';
import ChatPage from '../Features/Chat/Pages/ChatPage.jsx';
import Projects from '../Features/Projects/Pages/Projects.jsx';
import Analytics from '../Features/Analytics/Pages/Analytics.jsx';
import AdminDashboard from '../Features/Admin/Pages/AdminDashboard.jsx';
import Protect from './protect.jsx';

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/login" replace />
    },
    {
        path: "/chat",
        element: (
            <Protect>
                <ChatPage/>
            </Protect>
        )
    },
    {
        path: "/projects",
        element: (
            <Protect>
                <Projects/>
            </Protect>
        )
    },
    {
        path: "/analytics",
        element: (
            <Protect>
                <Analytics/>
            </Protect>
        )
    },
    {
        path: "/admin",
        element: (
            <Protect>
                <AdminDashboard/>
            </Protect>
        )
    },
    {
        path: "/register",
        element:<Register/>
    },
    {
        path:'/login',
        element:<Login/>
    }
]);
