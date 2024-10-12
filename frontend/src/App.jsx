import { useEffect, useState } from 'react';
import './App.css'
import ProtectedRoute from './components/ProtectedRoute';
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Home from './pages/Home';

import axios from 'axios';
import PublicRoute from './components/PublicRoute';
import Hero from './pages/Hero';
import Footer from './pages/Footer';
import Login from './pages/Login';

function App() {
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(false);

  const Layout = () => (
    <>
      <Hero setEmail={setEmail} email={email} />
      <main>
        <Outlet /> {/* Outlet will render the appropriate route content */}
      </main>
      <Footer />
    </>
  );

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />, // Layout for the main structure
      children: [
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
              <Home email={email} setEmail={setEmail} />
            </ProtectedRoute>
          ),
        },
        // Add other routes if needed
      ],
    },
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
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App
