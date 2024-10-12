import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.jsx'
import './index.css'
import Footer from './pages/Footer.jsx'
import Hero from './pages/Hero.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <GoogleOAuthProvider clientId={googleClientId}> */}
    <Hero/>
      <App />
    <Footer/>
    {/* </GoogleOAuthProvider> */}
  </StrictMode>,
)
