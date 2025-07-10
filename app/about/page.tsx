'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-primary-500">
      <Header />
      
      <main>
        {/* Hero Section */}
        <motion.section 
          className="relative h-[40vh] bg-primary-600 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-black/30 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-primary-600 to-primary-500"></div>
          
          <div className="relative z-20 h-full flex flex-col items-center justify-center text-ivory-400 text-center px-4">
            <motion.h1 
              className="text-4xl md:text-5xl font-serif mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Art Meets Jewelry
            </motion.h1>
            <motion.p
              className="max-w-xl text-ivory-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Where Young Artists Create Timeless Beauty
            </motion.p>
          </div>
        </motion.section>

        {/* Our Story */}
        <motion.section 
          className="py-16 px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto max-w-5xl">
            <motion.h2 
              className="text-3xl md:text-4xl font-serif text-center mb-8 text-ivory-400"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
            >
              Our Story
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                viewport={{ once: true }}
              >
                <div className="aspect-square bg-ivory-200 rounded-lg"></div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <h3 className="text-2xl font-serif text-ivory-400">Founded on Passion and Artistry</h3>
                <p className="text-ivory-300">
                  Our company was born from the creative partnership of two young artists who discovered their shared passion for jewelry making during their art studies. What began as a creative hobby quickly evolved into a professional venture.
                </p>
                <p className="text-ivory-300">
                  At 22, we combine fresh artistic perspectives with meticulous attention to detail, creating contemporary pieces that speak to modern aesthetics while honoring traditional craftsmanship techniques.
                </p>
                <p className="text-ivory-300">
                  Every piece in our collection is designed and handcrafted by us, ensuring that each creation carries our unique artistic vision and commitment to quality.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Our Values */}
        <motion.section 
          className="py-16 px-4 bg-ivory-200"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto max-w-5xl">
            <motion.h2 
              className="text-3xl md:text-4xl font-serif text-center mb-12 text-primary-500"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
            >
              Our Values
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Artistic Vision",
                  description: "Every piece is designed with fresh creative perspectives, combining contemporary aesthetics with timeless appeal."
                },
                {
                  title: "Handcrafted Quality",
                  description: "We personally craft each piece using premium materials and meticulous attention to detail in our studio workshop."
                },
                {
                  title: "Personal Touch",
                  description: "As a small, artist-owned business, we ensure every customer receives personalized service and unique, meaningful jewelry."
                }
              ].map((value, index) => (
                <motion.div 
                  key={index}
                  className="bg-ivory-400 p-6 rounded-lg shadow-sm border border-primary-200"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + (index * 0.2), duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-xl font-serif mb-3 text-primary-500">{value.title}</h3>
                  <p className="text-primary-400">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Our Team */}
        <motion.section 
          className="py-16 px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto max-w-5xl">
            <motion.h2 
              className="text-3xl md:text-4xl font-serif text-center mb-12 text-ivory-400"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
            >
              Meet Our Team
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 justify-center">
              {[
                { name: "Maya Chen", role: "Co-Founder & Lead Designer" },
                { name: "Aria Rodriguez", role: "Co-Founder & Master Artisan" }
              ].map((member, index) => (
                <motion.div 
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + (index * 0.1), duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="w-40 h-40 mx-auto rounded-full bg-ivory-200 mb-4"></div>
                  <h3 className="font-medium text-ivory-400">{member.name}</h3>
                  <p className="text-ivory-300 text-sm">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section 
          className="py-16 px-4 bg-primary-600 text-ivory-400"
          id="contact"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto max-w-5xl">
            <motion.h2 
              className="text-3xl md:text-4xl font-serif text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
            >
              Contact Us
            </motion.h2>
            
            <motion.p 
              className="text-center text-white/80 max-w-2xl mx-auto mb-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              viewport={{ once: true }}
            >
              We&apos;d love to hear from you. Whether you have a question about our products, need assistance with an order,
              or just want to say hello, our team is here to help.
            </motion.p>
            
            <motion.div 
              className="bg-ivory-400 rounded-lg p-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-primary-500 mb-1">Name</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 border border-primary-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 bg-ivory-400 text-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-primary-500 mb-1">Email</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border border-primary-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 bg-ivory-400 text-primary-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-primary-500 mb-1">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-2 border border-primary-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 bg-ivory-400 text-primary-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-primary-500 mb-1">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 border border-primary-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 bg-ivory-400 text-primary-500"
                  ></textarea>
                </div>
                
                <motion.button
                  type="submit"
                  className="w-full bg-ivory-400 text-primary-500 py-3 px-6 rounded-full hover:bg-ivory-300 transition-colors font-medium shadow-lg border border-primary-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Send Message
                </motion.button>
              </form>
            </motion.div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
