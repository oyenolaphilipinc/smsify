"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Globe, Clock, Users, Coins } from "lucide-react";

export function Benefits() {
  const benefits = [
    {
      icon: <Shield className="h-12 w-12 text-primary" />,
      title: "Enterprise Security",
      description: "End-to-end encryption and compliance with global standards",
    },
    {
      icon: <Zap className="h-12 w-12 text-primary" />,
      title: "Lightning Fast",
      description: "Deliver thousands of messages in seconds",
    },
    {
      icon: <Globe className="h-12 w-12 text-primary" />,
      title: "Global Reach",
      description: "Send messages to over 150 countries worldwide",
    },
    {
      icon: <Clock className="h-12 w-12 text-primary" />,
      title: "24/7 Support",
      description: "Round-the-clock expert assistance",
    },
    {
      icon: <Users className="h-12 w-12 text-primary" />,
      title: "Smart Targeting",
      description: "Segment your audience for better engagement",
    },
    {
      icon: <Coins className="h-12 w-12 text-primary" />,
      title: "Cost Effective",
      description: "Competitive pricing with volume discounts",
    },
  ];

  return (
    <section id="benefits" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Us
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Industry-leading features that set us apart
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
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}