import axios from 'axios';
import React from 'react'
import {  useNavigate } from 'react-router-dom';
import logo from '../assets/barabari_logo.png'

const Hero = ({ setEmail,email }) => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/logout`, {
        withCredentials: true,
      });
      navigate('/');
      setEmail(null);
    } catch (error) {
      toast.error("Internal Server Error. Please try again later.");
    }
  }
  return (
    <header className="z-50 fixed top-0 w-full bg-white">
      <div className="h-[70px]  flex items-center px-8 md:px-12 lg:px-32 xl:px-48 justify-between">
        <div className="flex gap-2 items-center">
          <a href="index.html">
            <img
              src={logo}
              className="drop-shadow-lg w-[40px] h-[40px] cursor-pointer"
              alt="Barabari Logo"
            />
          </a>
          <span className="font-bold hidden sm:block text-2xl drop-shadow-lg tracking-wider text-black">
            Barabari Collective
          </span>
        </div>
        <div className="hidden md:flex gap-2">
          <a href="https://forms.gle/WcF55jH3LvK93GTs9">
            <button className="bg-[#324498] hover:bg-[#4bd98f] text-white px-3 py-1 font-semibold focus:outline-none  transition-colors duration-300">
              Donate
            </button>
          </a>
          <a href="https://www.barabaricollective.org/services.html">
            <button className="bg-[#324498] hover:bg-[#4bd98f] text-white px-3 py-1 font-semibold focus:outline-none  transition-colors duration-300">
              Hire From Us
            </button>
          </a>
          {email &&
            <button className="bg-[#324498] hover:bg-[#4bd98f] text-white px-3 py-1 font-semibold focus:outline-none  transition-colors duration-300" onClick={handleLogout}>
              Logout
            </button>
          }
        </div>
        <div id="hamburger" className="block md:hidden animate__zoomInDown">
          <input id="menu-toggle" className="hidden peer" type="checkbox" />
          <label htmlFor="menu-toggle">
            <div className="w-12 h-12 cursor-pointer flex flex-col items-center justify-center">
              <div className="w-[50%] h-[3px] bg-black rounded-sm transition-all duration-300 origin-left translate-y-[0.6rem] peer-checked:rotate-[-45deg]"></div>
              <div className="w-[50%] h-[3px] bg-black rounded-md transition-all duration-300 origin-center peer-checked:hidden"></div>
              <div className="w-[50%] h-[3px] bg-black rounded-md transition-all duration-300 origin-left -translate-y-[0.6rem] peer-checked:rotate-[45deg]"></div>
            </div>
          </label>

          <div className="fixed top-[70px] right-0 w-full h-full bg-white shadow-lg transform translate-x-full peer-checked:translate-x-0 transition-transform duration-400 ease-in-out">
            <div className="flex flex-col items-center justify-center h-full">
              <a
                href="https://forms.gle/WcF55jH3LvK93GTs9"
                className="peer-checked:animate__zoomInDown peer-checked:animate__delay-2s"
              >
                <button className="bg-[#3cc88f] hover:bg-[#4bd98f] text-white px-3 py-1 font-semibold focus:outline-none rounded-lg transition-colors duration-300">
                  Donate
                </button>
              </a>
              <a
                href="services.html"
                className="peer-checked:animate__zoomInDown peer-checked:animate__delay-2s"
              >
                <button className="bg-[#3cc88f] hover:bg-[#4bd98f] text-white px-3 py-1 font-semibold focus:outline-none rounded-lg transition-colors duration-300">
                  Hire From Us
                </button>
              </a>
              {email &&
                <button className="bg-[#3cc88f] hover:bg-[#4bd98f] text-white px-3 py-1 font-semibold focus:outline-none rounded-lg transition-colors duration-300" onClick={handleLogout}>
                  Logout
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Hero
