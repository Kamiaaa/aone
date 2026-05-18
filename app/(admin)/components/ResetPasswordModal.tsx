// components/ResetPasswordModal.tsx
'use client';

import React, { useState } from 'react';

interface ResetPasswordModalProps {
  isOpen: boolean;
  customerName: string;
  temporaryPassword: string;
  customerEmail?: string;
  onClose: () => void;
  onSendEmail?: (password: string) => Promise<void>;
}

export default function ResetPasswordModal({
  isOpen,
  customerName,
  temporaryPassword,
  customerEmail,
  onClose,
  onSendEmail
}: ResetPasswordModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy to clipboard');
    }
  };

  const messageTemplates = {
    sms: `Your password has been reset. Temporary password: ${temporaryPassword}. Please change it after login.`,
    whatsapp: `🔐 *Password Reset*\n\nHello ${customerName},\n\nYour temporary password is: *${temporaryPassword}*\n\nPlease change your password after login for security.\n\n- Admin Team`,
    email: `Dear ${customerName},

Your password has been reset successfully. Please use the following credentials to login:

Temporary Password: ${temporaryPassword}

For security reasons, please change your password after your first login.

Best regards,
Admin Team`
  };

  const handleSendEmail = async () => {
    if (onSendEmail && customerEmail) {
      setSendingEmail(true);
      await onSendEmail(temporaryPassword);
      setSendingEmail(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 pb-3 border-b">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-full">
              <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Password Reset Successful</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-5">
          {/* Success Badge */}
          <div className="flex items-center justify-center p-3 bg-green-50 rounded-lg border border-green-200">
            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-green-800">
              Password reset for <strong>{customerName}</strong>
            </span>
          </div>

          {/* New Password Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🔐 New Temporary Password
            </label>
            <div className="relative">
              <div className="bg-white p-3 rounded-lg border border-gray-300 font-mono text-lg font-semibold text-gray-900 break-all">
                {temporaryPassword}
              </div>
              <button
                onClick={() => copyToClipboard(temporaryPassword, 'password')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
              >
                {copiedField === 'password' ? (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              ⚠️ Customer must change this password after first login
            </p>
          </div>

          {/* Quick Copy Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📋 Quick Copy Options
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => copyToClipboard(messageTemplates.sms, 'sms')}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm flex items-center justify-center gap-1 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                SMS
              </button>
              <button
                onClick={() => copyToClipboard(messageTemplates.whatsapp, 'whatsapp')}
                className="px-3 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-sm flex items-center justify-center gap-1 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                WhatsApp
              </button>
              <button
                onClick={() => copyToClipboard(messageTemplates.email, 'email')}
                className="px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm flex items-center justify-center gap-1 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </button>
            </div>
          </div>

          {/* Full Message Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📧 Complete Message (Copy & Send)
            </label>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-800 space-y-2 max-h-60 overflow-y-auto whitespace-pre-wrap">
                {messageTemplates.email}
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(messageTemplates.email, 'full-message')}
              className="mt-2 w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center gap-2 transition-colors"
            >
              {copiedField === 'full-message' ? (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied to Clipboard!
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                  </svg>
                  Copy Complete Message
                </>
              )}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
            {onSendEmail && customerEmail && (
              <button
                onClick={handleSendEmail}
                disabled={sendingEmail}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingEmail ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Send Email
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}