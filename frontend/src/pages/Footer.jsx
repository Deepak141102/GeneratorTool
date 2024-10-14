import React from 'react';
import { MdOutlinePhoneInTalk,MdAttachEmail } from "react-icons/md";
import { FaInstagram,FaLinkedin } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";
import logo from "../assets/barabari_logo.png"

const developers = [
  {
    name: "Drumil Akhenia",
    image: "/assets/drumil.jpg",
    linkedin: "https://www.linkedin.com/in/drumil-akhenia/",
  },
  {
    name: "Deepak Sagar",
    image: "/assets/deepak.jpg",
    linkedin: "https://www.linkedin.com/in/deepak-sagar1/",
  }
];

const Footer = () => {
  return (
    <footer className="bg-[#181818] text-white py-10 flex flex-col justify-center items-center p-[2rem 1rem] m-auto">
      <div className="container mx-auto px-6 max-w-[1200px] w-full p-[2rem 3rem] flex justify-center flex-col items-center gap-8">
        <div className=" bg-[#1e1e1e] credits mb-8 p-8 text-center w-full flex flex-col justify-between items-center flex-wrap rounded-2xl shadow-xl">
          <h2 className="text-[1.8rem] text-[#ffd500] font-bold uppercase mb-4 flex-[1 100%] text-center ">
            This platform is built by students of <br /> our program!
          </h2>
          <div className="developerImageContainer flex justify-center items-center gap-[5px]">
            {developers.map((developer) => (
              <a
                key={developer.name}
                title={developer.name}
                href={developer.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="developer w-[80px] h-[80px] rounded-[50%] overflow-hidden transition-transform ease-in-out duration-500 hover:transform hover:scale-[1.1] hover:border-[#ffd500] hover:border-[2px] hover:border-solid outline-none"
              >
                <img
                  src={developer.image}
                  alt={developer.name}
                  className="w-full h-full object-cover rounded-full  shadow-lg"
                />
              </a>
            ))}
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="information flex flex-col  justify-between items-start md:items-center">
          <div className="pagesContainer mb-6 md:mb-0 md:text-left flex items-center flex-col gap-4 mx-auto">
            <div className="footer-logo flex items-center justify-center md:justify-start mb-4">
              <img src={logo} alt="Rozgar" className="w-12 h-12 mr-2" />
              <h2 className="text-xl font-extrabold text-[#f9f9f9]">Barabari Collective</h2>
            </div>
            <ul className="contact-info space-y-2">
              <li>
                <a href="tel:+918639322365" className="flex items-center">
                <MdOutlinePhoneInTalk  className='mr-2'/>
                +91 8639322365
                </a>
              </li>
              <li>
                <a href="mailto:info@barabaricollective.org" className="flex items-center">
                  <MdAttachEmail className='mr-2'/> info@barabaricollective.org
                </a>
              </li>
            </ul>
          <div className="social-media flex justify-center gap-[15px] mt-4 md:mt-0">
        <a href="https://x.com/BarabariProject" target="_blank" rel="noopener noreferrer" className='text-white bg-black rounded-[50%] p-3 w-10 h-10 flex items-center justify-center transition-all ease-linear hover:transform hover:scale-[1.2] '>
              <RiTwitterXFill className=" text-2xl "/>
            </a>
            <a href="https://www.instagram.com/thebarabariproject/" target="_blank" rel="noopener noreferrer"className='text-white bg-black rounded-[50%] p-3 w-10 h-10 flex items-center justify-center transition-all ease-linear hover:transform hover:scale-[1.2] '>
              <FaInstagram className="text-2xl"/>
            </a>
            <a href="https://www.linkedin.com/company/the-barabari-collective/" target="_blank" rel="noopener noreferrer"className='text-white bg-black rounded-[50%] p-3 w-10 h-10 flex items-center justify-center transition-all ease-linear hover:transform hover:scale-[1.2] '>
              <FaLinkedin className="text-2xl "/>
            </a>
          </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
