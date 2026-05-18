'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { MdOutlinePhoneForwarded } from "react-icons/md";

const PromotionalBanner = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleDonateClick = () => {
        // Add your donation page URL or payment integration here
        window.location.href = '/donate';
        // Or if using Next.js router:
        // router.push('/donate');
    };

    const handleGetInvolvedClick = () => {
        // Add your get involved page URL here
        window.location.href = '/get-involved';
        // Or if using Next.js router:
        // router.push('/get-involved');
    };

    return (
        <section
            ref={containerRef}
            className="relative w-full h-125 overflow-hidden bg-fixed bg-center bg-cover bg-no-repeat mt-20"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=884&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
        >
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 space-y-6">
                {/* Heading */}
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-source font-bold text-white max-w-6xl z-10">
                    Need Fast & Secure Broadband? Use A1 Communication & The Real Network.
                </h2>
                {/* Two Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 z-10">
                    {/* View Our Plan Button */}
                    <button
                        onClick={handleDonateClick}
                        className="relative overflow-hidden bg-red-600 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg group flex items-center justify-center gap-2"
                        aria-label="Donate Now"
                    >
                        <MdOutlinePhoneForwarded className="text-xl relative z-10" />
                        <span className="relative z-10">View Our Plan</span>
                        <span className="absolute inset-0 bg-red-700 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0"></span>
                    </button>
                    
                    {/* Contact Sales Button */}
                    <Link href={'/donate'}>
                        <button className="relative overflow-hidden bg-transparent border-2 border-red-600 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg group">
                            <span className="relative z-10">09542366393</span>
                            <span className="absolute inset-0 bg-red-600 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0"></span>
                        </button>
                    </Link>
                </div>
            </div>

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/40 z-0" />
        </section>
    );
};

export default PromotionalBanner;