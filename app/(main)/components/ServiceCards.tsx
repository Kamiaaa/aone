'use client'
import React from 'react';
import { motion } from 'framer-motion';

// Custom SVG Icons
const Icons = {
    Broadband: () => (
        <svg className="h-20 w-20 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path d="M3 10h18M5 10v6a2 2 0 002 2h10a2 2 0 002-2v-6M8 10V6h8v4M6 20h12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),

    Wifi: () => (
        <svg className="h-20 w-20 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path d="M4 9a12 12 0 0116 0M7 12a8 8 0 0110 0M10 15a4 4 0 014 0M12 19h.01" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="3" y="17" width="18" height="3" rx="1" />
            <line x1="7" y1="17" x2="7" y2="14" />
            <line x1="17" y1="17" x2="17" y2="14" />
        </svg>
    ),

    Satellite: () => (
        <svg className="h-20 w-20 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path d="M5 19l6-6M3 21l2-2M14 3a7 7 0 017 7M14 7a3 3 0 013 3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="10" cy="14" r="3" />
            <line x1="10" y1="17" x2="10" y2="21" />
        </svg>
    ),

    Netflix: () => (
        <svg className="h-20 w-20 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <rect x="3" y="6" width="10" height="12" rx="1" />
            <path d="M13 10l6-3v10l-6-3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 8a3 3 0 013 3M16 5a6 6 0 016 6" strokeLinecap="round" />
        </svg>
    ),
};

interface CardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    bgImage: string;
    index: number;
}

const ServiceCard: React.FC<CardProps> = ({ title, description, icon, bgImage, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: "easeOut"
            }}
            whileHover={{ 
                y: -8,
                transition: { duration: 0.3 }
            }}
            className="group relative overflow-hidden bg-white dark:bg-gray-900 p-6 border border-gray-300 dark:border-gray-700 shadow-sm cursor-pointer"
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <motion.div 
                className="absolute inset-0 bg-white dark:bg-gray-900 transition-all duration-300 group-hover:bg-black/50 dark:group-hover:bg-black/70"
                initial={false}
                animate={{ opacity: 1 }}
                whileHover={{ opacity: 0 }}
            />

            <div className="relative z-10 flex flex-col items-start space-y-4">
                <motion.div 
                    className="p-3 text-white"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    {icon}
                </motion.div>

                <motion.h3 
                    className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300 group-hover:text-white"
                    whileHover={{ x: 5 }}
                >
                    {title}
                </motion.h3>

                <motion.p 
                    className="text-gray-600 dark:text-gray-300 text-lg transition-colors duration-300 group-hover:text-white/90"
                    whileHover={{ x: 5 }}
                >
                    {description}
                </motion.p>

                <motion.button 
                    className="mt-2 inline-flex items-center text-lg font-semibold text-red-600 dark:text-red-400 transition-all duration-300 group-hover:text-white group-hover:underline"
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Read More
                    <motion.svg 
                        className="ml-1 h-4 w-4"
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        animate={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </motion.svg>
                </motion.button>
            </div>
        </motion.div>
    );
};

const ServiceCardsGrid: React.FC = () => {
    const cardsData = [
        {
            title: 'Broadband',
            description: 'High-speed fiber broadband connection with unlimited data and 24/7 support for your home or business.',
            icon: <Icons.Broadband />,
            bgImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
        },
        {
            title: 'WIFI Internet',
            description: 'Mesh WiFi systems covering every corner of your home with seamless roaming and advanced security features.',
            icon: <Icons.Wifi />,
            bgImage: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
        },
        {
            title: 'Satellite TV',
            description: 'Over 500+ channels including HD sports, movies, and international content with cloud DVR storage.',
            icon: <Icons.Satellite />,
            bgImage: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
        },
        {
            title: 'Netflix TV Box',
            description: '4K Ultra HD streaming device with Netflix, Prime Video, Disney+ and all your favorite apps pre-installed.',
            icon: <Icons.Netflix />,
            bgImage: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1169&q=80',
        },
    ];

    // Container animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    return (
        <motion.div 
            className="bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="mx-auto max-w-7xl">
                <motion.div 
                    className="mb-12 text-center"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <motion.h2 
                        className="text-2xl tracking-tight font-source text-gray-900 dark:text-white sm:text-3xl md:text-6xl"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        Find Perfect Network Solutions
                    </motion.h2>
                    {/* <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                        Choose the perfect plan for your entertainment and connectivity needs
                    </p> */}
                </motion.div>

                <motion.div 
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {cardsData.map((card, index) => (
                        <ServiceCard
                            key={index}
                            index={index}
                            title={card.title}
                            description={card.description}
                            icon={card.icon}
                            bgImage={card.bgImage}
                        />
                    ))}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default ServiceCardsGrid;