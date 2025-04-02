"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Globe, Clock, Smartphone, Coins } from "lucide-react";

export function Benefits() {
  const benefits = [
    {
      icon: <Globe className="h-12 w-12 text-primary" />,
      title: "Global Numbers",
      description: "Access virtual numbers from over 150 countries worldwide",
    },
    {
      icon: <Shield className="h-12 w-12 text-primary" />,
      title: "Secure & Private",
      description: "Your messages are encrypted and protected with enterprise-grade security",
    },
    {
      icon: <Zap className="h-12 w-12 text-primary" />,
      title: "Instant Delivery",
      description: "Receive SMS messages instantly in your dashboard",
    },
    {
      icon: <Smartphone className="h-12 w-12 text-primary" />,
      title: "Multiple Numbers",
      description: "Manage multiple virtual numbers from different countries",
    },
    {
      icon: <Clock className="h-12 w-12 text-primary" />,
      title: "24/7 Availability",
      description: "Access your virtual numbers anytime, anywhere",
    },
    {
      icon: <Coins className="h-12 w-12 text-primary" />,
      title: "Flexible Pricing",
      description: "Pay only for the numbers you need, no hidden fees",
    },
  ];

  return (
    <section id="benefits" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Choose SMSCone
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The most reliable platform for receiving SMS messages with virtual numbers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 p-4 bg-primary/10 rounded-full">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}