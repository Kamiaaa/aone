import Image from 'next/image';
import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaArrowRight, FaLinkedinIn, FaWifi, FaServer, FaShieldAlt } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="relative text-gray-200 py-16 px-5 md:px-20 mt-auto">
      {/* Background with dark overlay */}
      <div className="absolute inset-0 z-0">
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-gray-900/95 via-gray-800/90 to-gray-900/85"></div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent)]"></div>
        
        {/* Subtle vignette effect */}
        <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 max-w-7xl mx-auto">
        {/* Company Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute -inset-1 bg-gray-700/40 rounded-lg blur-sm backdrop-blur-sm"></div>
              <div className="flex items-center space-x-3 relative">
                <div className="relative">
                  <div className="absolute inset-0 bg-gray-600/30 rounded-full blur-sm"></div>
                  <div className="w-20 h-20 relative overflow-hidden z-10 flex items-center justify-center">
                    <Image src={'/img/logo.png'} alt='logo' fill priority className="text-white text-2xl" />
                  </div>
                </div>
                <div>
                  <span className="text-white text-2xl font-bold drop-shadow-lg font-poppins">A1 Communication</span>
                  <p className="text-gray-300 text-sm font-medium drop-shadow">High-Speed Internet | Fiber Optic | Business Solutions</p>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-gray-200 text-lg leading-relaxed max-w-2xl drop-shadow-md backdrop-blur-sm bg-black/20 rounded-xl p-4 font-poppins">
            A1 Communications is a leading ISP provider delivering blazing-fast fiber optic internet, 
            reliable connectivity, and cutting-edge communication solutions for homes and businesses. 
            Experience the future of internet with 24/7 support and 99.9% uptime guarantee.
          </p>

          {/* Newsletter Subscription */}
          <div className="pt-2">
            <h3 className="text-gray-100 text-lg font-semibold mb-4 flex items-center drop-shadow font-poppins">
              Get Special Offers
              <span className="ml-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </h3>
            <div className="flex max-w-md bg-gray-900/80 backdrop-blur-sm rounded-xl p-1 border border-gray-700/60 shadow-xl">
              <input
                type="email"
                placeholder="Enter your email for exclusive deals"
                className="px-4 py-3 w-full bg-gray-900/70 backdrop-blur-sm rounded-l-lg focus:outline-none text-gray-200 placeholder-gray-300 focus:ring-2 focus:ring-red-500/50 border-none font-poppins"
              />
              <button className="bg-linear-to-r from-red-700 to-red-500 hover:from-red-500 hover:to-red-700 px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-700/30 hover:shadow-red-500/40 font-poppins">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <h3 className="text-gray-100 text-xl font-bold mb-2 relative inline-block drop-shadow font-poppins">
            Quick Links
            <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-gradient-to-r from-red-500 to-transparent"></span>
          </h3>
          <ul className="space-y-3">
            {[
              { href: "/", label: "Home" },
              { href: "/packages", label: "Internet Packages" },
              { href: "/business", label: "Business Solutions" },
              { href: "/fiber", label: "Fiber Optic" },
              { href: "/support", label: "Support" },
              { href: "/contact", label: "Contact" },
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <span className="group text-gray-200 hover:text-white transition-all duration-300 flex items-center py-2 backdrop-blur-sm hover:bg-black/20 rounded-lg px-3 -mx-3">
                    <FaArrowRight className="w-3 h-3 text-red-500 mr-3 transform group-hover:translate-x-1 transition-transform" />
                    <span className="relative font-poppins">
                      {item.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <h3 className="text-gray-100 text-xl font-bold mb-2 relative inline-block drop-shadow font-poppins">
            Contact Us
            <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-linear-to-r from-red-500 to-transparent"></span>
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 group cursor-pointer backdrop-blur-sm hover:bg-black/20 rounded-xl p-3 -m-3 transition-all duration-300">
              <div className="p-3 bg-gray-900/80 backdrop-blur-sm rounded-xl group-hover:bg-red-700/40 transition-all duration-300 border border-gray-700/50 group-hover:border-red-500/40 min-w-12">
                <FaMapMarkerAlt className="text-gray-300 text-lg" />
              </div>
              <div className="text-gray-200 leading-relaxed">
                <a href='https://maps.app.goo.gl/' target='_blank' rel="noopener noreferrer" className="group/link">
                  <p className="group-hover/link:text-gray-300 transition-colors drop-shadow font-poppins">Uttara, Dhaka -1230</p>
                </a>
                {/* <a href='https://maps.app.goo.gl/' target='_blank' rel="noopener noreferrer" className="group/link mt-2 block">
                  <p className="group-hover/link:text-gray-300 transition-colors drop-shadow text-sm font-poppins">California, USA - 94025</p>
                </a> */}
              </div>
            </div>

            <div className="flex items-center gap-4 group cursor-pointer backdrop-blur-sm hover:bg-black/20 rounded-xl p-3 -m-3 transition-all duration-300">
              <div className="p-3 bg-gray-900/80 backdrop-blur-sm rounded-xl group-hover:bg-red-700/40 transition-all duration-300 border border-gray-700/50 group-hover:border-red-500/40 min-w-12">
                <FaPhoneAlt className="text-gray-300 text-lg" />
              </div>
              <div>
                <p className="text-gray-200 group-hover:text-gray-300 transition-colors drop-shadow font-poppins">1-800-A1-FIBER</p>
                <p className="text-gray-300 text-sm drop-shadow font-poppins">24/7 Customer Support</p>
              </div>
            </div>

            <div className="flex items-center gap-4 group cursor-pointer backdrop-blur-sm hover:bg-black/20 rounded-xl p-3 -m-3 transition-all duration-300">
              <div className="p-3 bg-gray-900/80 backdrop-blur-sm rounded-xl group-hover:bg-red-700/40 transition-all duration-300 border border-gray-700/50 group-hover:border-red-500/40 min-w-12">
                <FaEnvelope className="text-gray-300 text-lg" />
              </div>
              <div>
                <p className="text-gray-200 group-hover:text-gray-300 transition-colors drop-shadow font-poppins">support@a1communications.com</p>
                <p className="text-gray-300 text-sm drop-shadow font-poppins">sales@a1communications.com</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="pt-4">
            <h3 className="text-gray-100 text-lg font-semibold mb-4 drop-shadow font-poppins">Why Choose A1?</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 bg-gray-900/50 backdrop-blur-sm rounded-lg p-2">
                <FaServer className="text-red-500 text-sm" />
                <span className="text-gray-300 text-xs font-poppins">99.9% Uptime</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-900/50 backdrop-blur-sm rounded-lg p-2">
                <FaShieldAlt className="text-red-500 text-sm" />
                <span className="text-gray-300 text-xs font-poppins">Secure Network</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="pt-2">
            <h3 className="text-gray-100 text-lg font-semibold mb-4 drop-shadow font-poppins">Follow Us</h3>
            <div className="flex space-x-3">
              {[
                { icon: <FaFacebookF size={16} />, href: "#", color: "hover:bg-red-700/80" },
                { icon: <FaTwitter size={16} />, href: "#", color: "hover:bg-sky-600/80" },
                { icon: <FaInstagram size={16} />, href: "#", color: "hover:bg-pink-600/80" },
                { icon: <FaLinkedinIn size={16} />, href: "#", color: "hover:bg-red-800/80" },
                { icon: <FaYoutube size={16} />, href: "#", color: "hover:bg-red-700/80" },
              ].map((social, index) => (
                <Link key={index} href={social.href} target="_blank" rel="noopener noreferrer">
                  <span className={`bg-gray-900/80 backdrop-blur-sm ${social.color} w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 border border-gray-700/50 hover:border-transparent shadow-lg hover:shadow-xl`}>
                    {social.icon}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="relative z-10 border-t border-gray-700/60 mt-12 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left backdrop-blur-sm bg-black/20 rounded-xl p-4 md:p-2">
            <p className="text-gray-200 text-sm drop-shadow font-poppins">
              &copy; {new Date().getFullYear()} A1 Communications. All rights reserved.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 backdrop-blur-sm bg-black/20 rounded-xl p-4 md:p-2">
            <Link href="/privacy" className="text-gray-300 hover:text-gray-100 transition-colors text-sm font-medium relative group drop-shadow font-poppins">
              Privacy Policy
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-300 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/terms" className="text-gray-300 hover:text-gray-100 transition-colors text-sm font-medium relative group drop-shadow font-poppins">
              Terms of Service
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-300 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/refund" className="text-gray-300 hover:text-gray-100 transition-colors text-sm font-medium relative group drop-shadow font-poppins">
              Refund Policy
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-300 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/acceptable-use" className="text-gray-300 hover:text-gray-100 transition-colors text-sm font-medium relative group drop-shadow font-poppins">
              Acceptable Use Policy
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-300 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;