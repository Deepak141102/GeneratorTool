import { useEffect, useState } from 'react';
import './App.css'
import ProtectedRoute from './components/ProtectedRoute';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login'
import axios from 'axios';
import PublicRoute from './components/PublicRoute';

function App() {
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <PublicRoute email={email}>
          <Login />
        </PublicRoute>
      ),
    },
    {
      path: "/home",
      element: (
        <ProtectedRoute email={email}>
          <Home />
        </ProtectedRoute>
      ),
    },
    // Add other routes as needed
  ]);
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/user`, {
          withCredentials: true,
        });
        setEmail(response.data.emails[0].verified ? response.data.emails[0].value : null);
      } catch (error) {
        setEmail(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);
  return (
    <RouterProvider router={router} />
  );
}

export default App
