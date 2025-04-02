"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      name: "Alex Thompson",
      role: "Software Developer",
      company: "TechStart",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      content: "SMSCone has been a game-changer for our app testing. We can easily get virtual numbers from different countries to test our SMS verification system. The instant delivery is impressive!",
      rating: 5,
    },
    {
      name: "Maria Garcia",
      role: "Product Manager",
      company: "GlobalApp",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      content: "The variety of virtual numbers available is amazing. We use it for our international user verification, and it's been incredibly reliable. The dashboard makes managing multiple numbers so easy.",
      rating: 5,
    },
    {
      name: "David Chen",
      role: "Founder",
      company: "StartupX",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      content: "Best virtual SMS service I've used. The numbers are always available, and the support team is super helpful. Perfect for our international business needs.",
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Loved by Developers Worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of developers who trust SMSCone for their virtual SMS needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover mr-4 ring-2 ring-primary/10"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-600 leading-relaxed">{testimonial.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}