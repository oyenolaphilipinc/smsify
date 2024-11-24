"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  const faqs = [
    {
      question: "What is the message delivery success rate?",
      answer:
        "We maintain a 99.9% delivery success rate through our direct carrier connections and intelligent routing system.",
    },
    {
      question: "How quickly are messages delivered?",
      answer:
        "Messages are typically delivered within seconds. Our platform can handle thousands of messages per second.",
    },
    {
      question: "Do you support international messaging?",
      answer:
        "Yes, we support SMS delivery to over 150 countries worldwide with competitive rates.",
    },
    {
      question: "What kind of support do you offer?",
      answer:
        "We provide 24/7 technical support through email, chat, and phone. Enterprise customers get dedicated account managers.",
    },
    {
      question: "Is there a minimum commitment?",
      answer:
        "No, we offer flexible pay-as-you-go pricing as well as volume-based packages to suit your needs.",
    },
  ];

  return (
    <section id="faq" className="py-24 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our platform
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}