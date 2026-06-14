// app/components/ISPFAQ.tsx
'use client';

import { useState } from 'react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'technical' | 'billing' | 'support';
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'What internet plans do you offer?',
    answer: 'We offer a range of internet plans to suit different needs: Basic (50 Mbps), Standard (100 Mbps), Premium (250 Mbps), and Ultra (1 Gbps). All plans come with unlimited data, no hidden fees, and a free Wi-Fi router installation.',
    category: 'general'
  },
  {
    id: '2',
    question: 'How do I check if your service is available at my address?',
    answer: 'You can check availability by visiting our website and entering your address in the coverage checker, or by calling our customer service at 1-800-ISP-HELP. Our coverage map shows real-time availability in your area.',
    category: 'general'
  },
  {
    id: '3',
    question: 'What should I do if my internet is not working?',
    answer: 'Try these troubleshooting steps: 1) Restart your modem and router, 2) Check all cable connections, 3) Visit our network status page for outages. If issues persist, contact our 24/7 technical support for immediate assistance.',
    category: 'technical'
  },
  {
    id: '4',
    question: 'How can I pay my bill online?',
    answer: 'You can pay your bill through our customer portal, mobile app, or by setting up automatic payments. We accept credit cards, debit cards, PayPal, and bank transfers. Late payments may incur a $5 fee after the 10-day grace period.',
    category: 'billing'
  },
  {
    id: '5',
    question: 'What is your refund policy?',
    answer: 'We offer a 30-day money-back guarantee for all new customers. If you\'re unsatisfied with our service, you can cancel within 30 days of activation for a full refund. Equipment must be returned in good condition.',
    category: 'billing'
  },
  {
    id: '6',
    question: 'Do you provide Wi-Fi routers?',
    answer: 'Yes, we provide a free high-performance Wi-Fi 6 router with all plans. The router includes enhanced security features, guest network capability, and parental controls. Professional installation is available for $49.99.',
    category: 'technical'
  },
  {
    id: '7',
    question: 'What are your customer support hours?',
    answer: 'Our technical support is available 24/7/365 via phone and live chat. Billing inquiries can be handled Monday-Friday 8 AM-8 PM EST. Emergency outage support is available around the clock.',
    category: 'support'
  },
  {
    id: '8',
    question: 'How do I set up parental controls?',
    answer: 'Parental controls can be configured through our mobile app or web portal. You can set time limits, block specific websites, and schedule internet access times for different devices on your network.',
    category: 'technical'
  }
];

const categoryColors = {
  general: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  technical: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  billing: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  support: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
};

export default function IspFaq() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(faqData.map(faq => faq.category))];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-2xl tracking-tight font-source text-gray-900 dark:text-white sm:text-3xl md:text-6xl mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Find answers to common questions about our internet services
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Column - Image Section */}
        <div className="order-2 lg:order-1">
          <div className="sticky top-8">
            <div className="bg-gradient-to-br from-blue-500 to-red-600 rounded-2xl overflow-hidden shadow-xl">
              {/* Main Image - ISP/Network Illustration */}
              <div className="relative bg-white dark:bg-gray-800 p-8">
                <svg className="w-full h-auto" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="400" height="400" rx="20" fill="url(#gradient)" fillOpacity="0.1"/>
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#3B82F6"/>
                      <stop offset="100%" stopColor="#8B5CF6"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Globe/Network Icon */}
                  <circle cx="200" cy="200" r="120" stroke="#3B82F6" strokeWidth="3" fill="none" strokeDasharray="8 8"/>
                  <circle cx="200" cy="200" r="90" stroke="#8B5CF6" strokeWidth="2" fill="none"/>
                  <circle cx="200" cy="200" r="60" stroke="#3B82F6" strokeWidth="2" fill="none" strokeDasharray="6 6"/>
                  
                  {/* Connection lines */}
                  <line x1="200" y1="80" x2="200" y2="320" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 4"/>
                  <line x1="80" y1="200" x2="320" y2="200" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 4"/>
                  <line x1="115" y1="115" x2="285" y2="285" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 4"/>
                  <line x1="285" y1="115" x2="115" y2="285" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 4"/>
                  
                  {/* Nodes */}
                  <circle cx="200" cy="80" r="8" fill="#3B82F6"/>
                  <circle cx="200" cy="320" r="8" fill="#3B82F6"/>
                  <circle cx="80" cy="200" r="8" fill="#3B82F6"/>
                  <circle cx="320" cy="200" r="8" fill="#3B82F6"/>
                  <circle cx="200" cy="200" r="12" fill="#8B5CF6"/>
                  <circle cx="140" cy="140" r="6" fill="#10B981"/>
                  <circle cx="260" cy="140" r="6" fill="#F59E0B"/>
                  <circle cx="140" cy="260" r="6" fill="#EF4444"/>
                  <circle cx="260" cy="260" r="6" fill="#06B6D4"/>
                  
                  {/* Devices */}
                  <rect x="155" y="290" width="90" height="50" rx="5" fill="#3B82F6" fillOpacity="0.2" stroke="#3B82F6" strokeWidth="2"/>
                  <rect x="165" y="298" width="20" height="15" rx="2" fill="#3B82F6"/>
                  <rect x="195" y="298" width="20" height="15" rx="2" fill="#3B82F6"/>
                  <rect x="225" y="298" width="20" height="15" rx="2" fill="#3B82F6"/>
                  
                  {/* Signal waves */}
                  <path d="M 70 70 Q 100 100 70 130" stroke="#10B981" strokeWidth="2" fill="none"/>
                  <path d="M 55 55 Q 100 100 55 145" stroke="#10B981" strokeWidth="2" fill="none" opacity="0.6"/>
                  <path d="M 40 40 Q 100 100 40 160" stroke="#10B981" strokeWidth="2" fill="none" opacity="0.3"/>
                </svg>
              </div>
              
              {/* Stats/Info Cards */}
              <div className="p-6 bg-white/10 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">99.9%</div>
                    <div className="text-sm text-blue-100">Uptime Guarantee</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">24/7</div>
                    <div className="text-sm text-blue-100">Support Available</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">1 Gbps</div>
                    <div className="text-sm text-blue-100">Ultra Speed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">30 Days</div>
                    <div className="text-sm text-blue-100">Money Back</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-6 flex justify-center space-x-6">
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-sm">Trusted by 50k+ Customers</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                </svg>
                <span className="text-sm">Fiber Optic Network</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - FAQ Section */}
        <div className="order-1 lg:order-2">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 pr-4 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <svg
                className="absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap capitalize
                  ${selectedCategory === category
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }
                `}
              >
                {category === 'all' ? 'All Questions' : category}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-3 max-h-150 overflow-y-auto pr-2 custom-scrollbar">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p className="text-gray-500 dark:text-gray-400">No questions found matching your criteria.</p>
                <p className="text-sm text-gray-400 mt-2">Try different search terms or categories.</p>
              </div>
            ) : (
              filteredFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all hover:shadow-md"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-start space-x-2 flex-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${categoryColors[faq.category]}`}>
                        {faq.category === 'general' && (
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                        )}
                        {faq.category === 'technical' && (
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"/>
                          </svg>
                        )}
                        {faq.category === 'billing' && (
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                          </svg>
                        )}
                        {faq.category === 'support' && (
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                        )}
                        <span className="hidden sm:inline capitalize">{faq.category}</span>
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {faq.question}
                      </span>
                    </div>
                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 flex-shrink-0 ml-2 ${
                        openId === faq.id ? 'transform rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>
                  
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      openId === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    } overflow-hidden`}
                  >
                    <div className="px-4 pb-3 pt-1 text-sm text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Contact Support Section */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-lg text-center">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              Still have questions?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              Our support team is ready to help you 24/7
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button className="px-4 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                Live Chat
              </button>
              <button className="px-4 py-1.5 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors">
                Call Support
              </button>
              <button className="px-4 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Email Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}