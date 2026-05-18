// components/ContactPage.tsx
'use client';
import { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaLinkedin, 
  FaTwitter, 
  FaFacebook,
  FaInstagram,
  FaPaperPlane,
  FaClock,
  FaGlobe
} from 'react-icons/fa';
import { FiUser, FiMail, FiPhone, FiMessageSquare } from 'react-icons/fi';

const ContactPage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      alert('Thank you for your message! We will get back to you soon.');
      setLoading(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 2000);
  };

  const contactInfo = [
    {
      icon: FaEnvelope,
      title: 'Email Us',
      details: 'info@a1communications.com',
      description: 'Send us an email anytime',
      color: 'from-red-500 to-red-700'
    },
    {
      icon: FaPhone,
      title: 'Call Us',
      details: '09542366393, 01824382951-52',
      description: 'Mon-Fri from 9am to 6pm',
      color: 'from-red-500 to-red-700'
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Visit Us',
      details: 'Uttara, Dhaka -1230',
      description: 'Bangladesh',
      color: 'from-red-500 to-red-700'
    },
    {
      icon: FaClock,
      title: 'Office Hours',
      details: 'Saturday - Thursday',
      description: '9:00 AM - 6:00 PM EST',
      color: 'from-red-500 to-red-700'
    }
  ];

  const socialLinks = [
    { icon: FaLinkedin, href: '#', color: 'hover:text-red-400' },
    { icon: FaTwitter, href: '#', color: 'hover:text-cyan-300' },
    { icon: FaFacebook, href: '#', color: 'hover:text-red-300' },
    { icon: FaInstagram, href: '#', color: 'hover:text-red-400' }
  ];

  // Animation variants with proper typing
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const heroVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const formFieldVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <motion.div 
        className="relative bg-gray-900 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <img
            className="w-full h-full object-cover opacity-40"
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=2070&q=80"
            alt="Modern office background"
          />
          <div className="absolute inset-0 bg-linear-to-r from-red-600 to-red-500 mix-blend-multiply" />
        </motion.div>

        <div className="relative z-10 py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              className="text-4xl font-source font-semibold text-white sm:text-5xl lg:text-6xl mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Get In Touch
            </motion.h1>
            <motion.p 
              className="text-xl text-red-100 max-w-2xl mx-auto leading-relaxed"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Ready to start your next project? We'd love to hear from you. 
              Send us a message and we'll respond as soon as possible.
            </motion.p>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        className="py-16 px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <motion.div 
              className="lg:col-span-1"
              variants={itemVariants}
            >
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 h-full transition-colors duration-300"
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <motion.h2 
                  className="text-2xl font-bold text-gray-900 dark:text-white mb-8"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Let's Talk
                </motion.h2>
                <motion.p 
                  className="text-gray-600 dark:text-gray-300 mb-8"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Have a project in mind? We're here to help. Send us a message and we'll get back to you within 24 hours.
                </motion.p>

                {/* Contact Info Cards */}
                <div className="space-y-6 mb-8">
                  {contactInfo.map((item, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-start group"
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                      whileHover={{ x: 5 }}
                    >
                      <motion.div 
                        className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <item.icon className="h-6 w-6 text-white" />
                      </motion.div>
                      <div className="ml-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                        <p className="text-gray-900 dark:text-white font-medium">{item.details}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Social Links */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={index}
                        href={social.href}
                        className={`w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 ${social.color} transition-all duration-300`}
                        whileHover={{ scale: 1.2, y: -3 }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.9 + index * 0.1, type: "spring", stiffness: 200 }}
                      >
                        <social.icon className="h-5 w-5" />
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              className="lg:col-span-2"
              variants={itemVariants}
            >
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 transition-colors duration-300"
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Send us a Message</h2>
                  <p className="text-gray-600 dark:text-gray-300">Fill out the form below and we'll get back to you soon.</p>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <motion.div 
                      className="relative"
                      variants={formFieldVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.3 }}
                    >
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
                        />
                      </div>
                    </motion.div>

                    {/* Email */}
                    <motion.div 
                      className="relative"
                      variants={formFieldVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.4 }}
                    >
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your.email@example.com"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
                        />
                      </div>
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Phone */}
                    <motion.div 
                      className="relative"
                      variants={formFieldVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.5 }}
                    >
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Your phone number"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
                        />
                      </div>
                    </motion.div>

                    {/* Subject */}
                    <motion.div 
                      className="relative"
                      variants={formFieldVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.6 }}
                    >
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Subject *
                      </label>
                      <div className="relative">
                        <FiMessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <select
                          id="subject"
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none transition-all duration-300"
                        >
                          <option value="" className="text-gray-500 dark:text-gray-400">Select a subject</option>
                          <option value="general" className="text-gray-900 dark:text-white">General Inquiry</option>
                          <option value="project" className="text-gray-900 dark:text-white">Project Discussion</option>
                          <option value="partnership" className="text-gray-900 dark:text-white">Partnership</option>
                          <option value="support" className="text-gray-900 dark:text-white">Technical Support</option>
                          <option value="other" className="text-gray-900 dark:text-white">Other</option>
                        </select>
                      </div>
                    </motion.div>
                  </div>

                  {/* Message */}
                  <motion.div 
                    className="relative"
                    variants={formFieldVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.7 }}
                  >
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your project or inquiry..."
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 resize-none"
                    />
                  </motion.div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-linear-to-r from-red-600 to-red-500 text-white py-4 px-6 rounded-lg font-semibold hover:from-red-500 hover:to-red-600 focus:ring-4 focus:ring-red-200 dark:focus:ring-red-950 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                  >
                    {loading ? (
                      <>
                        <motion.div 
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <motion.div
                          whileHover={{ x: 3 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <FaPaperPlane className="h-5 w-5" />
                        </motion.div>
                        <span>Send Message</span>
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ContactPage;