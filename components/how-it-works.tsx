'use client';

import { motion } from 'framer-motion';
import {
  MessageSquare,
  Settings,
  Send,
  BarChart,
  ArrowRight,
} from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: <MessageSquare className="h-12 w-12 text-primary" />,
      title: 'Get Remote Number',
      description: 'Get any number from around the world',
    },
    {
      icon: <Settings className="h-12 w-12 text-primary" />,
      title: 'Configure Settings',
      description: 'Set up targeting, scheduling, and personalization',
    },
    {
      icon: <Send className="h-12 w-12 text-primary" />,
      title: 'Receive Messages',
      description: 'Deliver your messages to thousands instantly',
    },
    {
      icon: <BarChart className="h-12 w-12 text-primary" />,
      title: 'Track Results',
      description: 'Monitor delivery rates and engagement metrics',
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Send SMS messages in four simple steps
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <motion.div
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ArrowRight className="h-8 w-8 text-primary" />
                  </motion.div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}