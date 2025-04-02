"use client";

import { motion } from "framer-motion";
import { Globe, ArrowRight, CheckCircle, Mail, User, Building2, Shield, Sparkles } from "lucide-react";
import Link from "next/link";

export function SignUp() {
  return (
    <section id="signup" className="py-24 bg-gradient-to-b from-white via-gray-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                Start Your Journey Today
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Get Your Virtual Number
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                  in Minutes
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                Join thousands of users who trust SMSCONE for receiving SMS messages. Get Started and get your first virtual number in minutes.
              </p>
              <div className="space-y-6">
                {[
                  {
                    title: "Instant Activation",
                    description: "Get your virtual number instantly with our automated system"
                  },
                  {
                    title: "Global Coverage",
                    description: "Access numbers from 150+ countries worldwide"
                  },
                  {
                    title: "24/7 Support",
                    description: "Our team is always here to help you succeed"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start space-x-4 p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-100 hover:border-primary/20 transition-colors"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Create Your Account</h3>
                <p className="text-gray-600 mt-2">Get your first virtual number in minutes</p>
              </div>
              <form className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      placeholder="Enter your full name"
                      className="pl-10 block w-full rounded-xl border border-gray-200 bg-white/50 focus:border-primary focus:bg-white focus:ring-0 transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      placeholder="your.email@example.com"
                      className="pl-10 block w-full rounded-xl border border-gray-200 bg-white/50 focus:border-primary focus:bg-white focus:ring-0 transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="company"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Company/Project Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                      type="text"
                      id="company"
                      placeholder="Enter your company or project name"
                      className="pl-10 block w-full rounded-xl border border-gray-200 bg-white/50 focus:border-primary focus:bg-white focus:ring-0 transition-all duration-200"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/20 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4" />
                  <p>
                    By signing up, you agree to our{" "}
                    <Link href="/terms" className="text-primary hover:text-primary/90 font-medium">
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:text-primary/90 font-medium">
                      Privacy
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}