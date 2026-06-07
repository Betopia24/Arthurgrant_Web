"use client";

import React, { useState } from "react";
import Heading from "@/components/shared/Heading";
import {
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  Loader2,
  Phone,
} from "lucide-react";
import { useContactMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    description: "",
  });

  const [contact, { isLoading }] = useContactMutation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Field validations
    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!formData.subject.trim()) {
      toast.error("Please enter a subject.");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Please enter your message description.");
      return;
    }

    try {
      const response = await contact(formData).unwrap();
      if (response.success) {
        toast.success(
          response.message || "Contact form submitted successfully!",
        );
        setFormData({
          fullName: "",
          email: "",
          subject: "",
          description: "",
        });
      } else {
        toast.error(
          response.message || "Something went wrong. Please try again.",
        );
      }
    } catch (error: any) {
      console.error("Contact form submission error:", error);
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Failed to submit the contact form. Please try again.",
      );
    }
  };

  return (
    <div className="py-28 bg-gradient-to-br from-[#1A1646] via-[#05051E] to-[#05051E] text-white min-h-screen relative overflow-hidden flex flex-col justify-center">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="app-container max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-12">
          <Heading
            heading="Get in Touch with Us"
            subheading="Have questions, ideas, or feedback? Drop us a message, and our team will get back to you shortly."
            specialText="Touch"
            align="center"
          />
        </div>

        {/* Centered Contact Form Layout */}
        <div className="max-w-2xl mx-auto mt-8">
          <div className="relative p-8 rounded-2xl bg-gradient-to-br from-[#2B2E4E] to-[#12132F] border border-gray-700 shadow-2xl">
            {/* Glowing header accent line */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-gradient-from via-gradient-via to-gradient-to rounded-t-2xl" />

            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-1">
                Send us a Message
              </h3>
              <p className="text-sm text-gray-400">
                Feel free to inquire about our services or send your
                suggestions.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-semibold text-gray-300 mb-1.5"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="Please enter your full name"
                  className="input-style border border-gray-700/50 placeholder:text-gray-500 focus:border-[#FFBC6F]/40 transition-colors"
                />
              </div>

              {/* Email Address */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-300 mb-1.5"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="Please enter your email"
                  className="input-style border border-gray-700/50 placeholder:text-gray-500 focus:border-[#FFBC6F]/40 transition-colors"
                />
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-semibold text-gray-300 mb-1.5"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="Website Inquiry"
                  className="input-style border border-gray-700/50 placeholder:text-gray-500 focus:border-[#FFBC6F]/40 transition-colors"
                />
              </div>

              {/* Description (Message) */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-gray-300 mb-1.5"
                >
                  Message Details
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="Hello, I am interested in learning more..."
                  className="input-style border border-gray-700/50 placeholder:text-gray-500 focus:border-[#FFBC6F]/40 resize-none transition-colors"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-brand flex items-center justify-center gap-2 font-semibold text-white hover:opacity-90 active:scale-[0.99] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
