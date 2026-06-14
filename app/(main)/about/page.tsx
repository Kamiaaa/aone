// app/about/page.tsx or pages/about.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useAnimation, useInView, Variants } from 'framer-motion';
import { 
  FaRocket, 
  FaShieldAlt, 
  FaTachometerAlt, 
  FaUsers,
  FaGlobe,
  FaCheckCircle,
  FaAward,
  FaHandsHelping,
  FaChartLine,
  FaRegLightbulb,
  FaHeart,
  FaQuoteLeft,
  FaBolt
} from 'react-icons/fa';
import { MdDataUsage } from 'react-icons/md';
import { FiShield } from 'react-icons/fi';

const AboutPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Animation variants with proper typing
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const fadeInLeft: Variants = {
    hidden: { opacity: 0, x: -60 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const fadeInRight: Variants = {
    hidden: { opacity: 0, x: 60 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const scaleOnHover = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.3 }
    }
  };

  const values = [
    {
      icon: FaTachometerAlt,
      title: 'Blazing Fast',
      description: 'Lightning-fast fiber optic connections with speeds up to 10 Gbps.',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: FaShieldAlt,
      title: 'Enterprise Security',
      description: 'Advanced threat protection and DDoS mitigation for all customers.',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: FaRegLightbulb,
      title: 'Innovation First',
      description: 'Constantly evolving our network with cutting-edge technology.',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: FaHandsHelping,
      title: '24/7 Support',
      description: 'Round-the-clock technical support from real humans, not bots.',
      color: 'from-red-500 to-red-600'
    }
  ];

  const stats = [
    { value: '200K+', label: 'Happy Customers', icon: FaUsers },
    { value: '99.9%', label: 'Uptime Guarantee', icon: FaCheckCircle },
    { value: '15+', label: 'Years of Excellence', icon: FaAward },
    { value: '24/7', label: 'Customer Support', icon: FaHandsHelping },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-x-hidden">
      {/* Hero Section - Same style as Packages page */}
      <div className="relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover opacity-40"
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=2070&q=80"
            alt="Modern office background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 mix-blend-multiply" />
        </div>

        <div className="relative z-10 py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className={`transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6">
                <FaBolt className="w-4 h-4" />
                Our Story & Mission
              </div>
              <h1 className="text-4xl font-source font-bold text-white sm:text-5xl lg:text-6xl mb-6">
                About <span className="text-red-200">A1 Communication</span>
              </h1>
              
              {/* Feature indicators */}
              <div className="flex flex-wrap justify-center gap-6 mt-8">
                <div className="flex items-center gap-2 text-sm text-blue-100">
                  <FaRocket className="w-4 h-4" />
                  <span>Industry Leaders</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-100">
                  <MdDataUsage className="w-4 h-4 text-red-300" />
                  <span>200K+ Customers</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-100">
                  <FiShield className="w-4 h-4 text-purple-300" />
                  <span>15+ Years Experience</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              variants={fadeInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="order-2 lg:order-1"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-source font-semibold text-gray-900 dark:text-white mb-4">
                Our Story
              </h2>
              <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full mb-4 sm:mb-6" />
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 leading-relaxed">
                Founded in 2010, <span className="font-semibold text-red-600 dark:text-red-400">A1 Communication</span> began with a simple yet powerful vision: 
                to bring blazing-fast, reliable internet to every home and business in our community.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 leading-relaxed">
                What started as a small team of engineers in a single office has grown into a 
                regional leader in fiber-optic and wireless broadband technology. Today, we proudly 
                serve over 200,000 satisfied customers with a network that spans urban centers and 
                rural areas alike.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                But numbers don't define us — it's the relationships we build. Every new connection 
                is a promise kept, and every support call is a chance to exceed expectations. 
                We're not just an ISP; we're your digital partner.
              </p>
            </motion.div>
            <motion.div 
              className="relative rounded-2xl overflow-hidden shadow-2xl order-1 lg:order-2 mb-6 lg:mb-0"
              variants={fadeInRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.img
                src="https://images.unsplash.com/photo-1731458769726-cef60c792665?q=80&w=963&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="A1 Communication team working on network infrastructure"
                className="w-full h-64 sm:h-80 md:h-96 object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={stat.label}
                variants={fadeInUp}
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                className="text-center p-4"
              >
                <motion.div 
                  className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white mb-3 sm:mb-4 shadow-lg"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <stat.icon className="h-6 w-6 sm:h-8 sm:w-8" />
                </motion.div>
                <motion.div 
                  className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <motion.h2 
              className="text-2xl sm:text-3xl md:text-4xl font-source font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Our Mission & Vision
            </motion.h2>
            <motion.div 
              className="w-16 sm:w-20 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full mx-auto mb-4 sm:mb-6"
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            />
            <motion.p 
              className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Guiding everything we do — from network upgrades to customer support.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8"
              variants={fadeInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ scale: 1.03, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center mb-4 sm:mb-6"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <FaRocket className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </motion.div>
              <h3 className="text-xl sm:text-2xl font-source font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Our Mission</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                To deliver lightning-fast, reliable internet with transparent pricing and 
                human-centered support. We believe connectivity is a fundamental right that 
                drives education, innovation, and economic growth.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8"
              variants={fadeInRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ scale: 1.03, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center mb-4 sm:mb-6"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <FaGlobe className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </motion.div>
              <h3 className="text-xl sm:text-2xl font-source font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Our Vision</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                To build a future where every person, business, and device is seamlessly 
                connected — empowering communities, enabling remote work, and bridging the 
                digital divide for generations to come.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 to-amber-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <motion.h2 
              className="text-2xl sm:text-3xl md:text-4xl font-source font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Our Core Values
            </motion.h2>
            <motion.div 
              className="w-16 sm:w-20 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full mx-auto mb-4 sm:mb-6"
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            />
            <motion.p 
              className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              The principles that guide every decision we make.
            </motion.p>
          </div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {values.map((value, index) => (
              <motion.div 
                key={value.title}
                variants={fadeInUp}
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  transition: { duration: 0.3 }
                }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 text-center shadow-lg cursor-pointer"
              >
                <motion.div 
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-r ${value.color} flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <value.icon className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                </motion.div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-600 to-red-500">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <FaQuoteLeft className="h-10 w-10 sm:h-12 sm:w-12 text-white/30 mx-auto mb-4 sm:mb-6" />
          </motion.div>
          <motion.p 
            className="text-xl sm:text-2xl md:text-3xl text-white font-light leading-relaxed mb-6 sm:mb-8 px-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            "A1 Communication transformed our business. Their fiber internet is incredibly reliable, 
            and their support team goes above and beyond. I couldn't recommend them more."
          </motion.p>
          <motion.div 
            className="flex items-center justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div>
              <p className="text-white font-semibold text-base sm:text-lg">Minhazul Haque</p>
              <p className="text-red-200 text-sm sm:text-base">CEO, Sys Solutions</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl font-source font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 px-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Ready to Experience the A1 Difference?
          </motion.h2>
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 px-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Join thousands of satisfied customers who trust us for their internet needs.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.button 
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-semibold shadow-lg text-sm sm:text-base"
              whileHover={{ 
                scale: 1.05,
                background: "linear-gradient(to right, red-500, red-700)",
                boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              View Our Plans
            </motion.button>
            <motion.button 
              className="px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-red-600 text-red-600 dark:text-red-400 rounded-lg font-semibold text-sm sm:text-base"
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "red-500",
                borderColor: "red-700"
              }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Sales
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;