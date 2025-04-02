"use client";

import { motion } from "framer-motion";
import { CheckCircle, Globe, Smartphone, Zap } from "lucide-react";

export function RegisterSteps() {
  const steps = [
    {
      icon: <Globe className="h-6 w-6 text-primary" />,
      title: "Create Account",
      description: "Sign up with your email to get started",
    },
    {
      icon: <Smartphone className="h-6 w-6 text-primary" />,
      title: "Choose Number",
      description: "Select your virtual number from available countries",
    },
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: "Get Started",
      description: "Receive SMS messages instantly in your dashboard",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Start Receiving SMS in Minutes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get your virtual number in three simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    {step.icon}
                  </div>
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary/30" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}