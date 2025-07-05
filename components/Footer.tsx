'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
  const footerSections = [
    {
      title: 'QUICK LINKS',
      links: [
        { name: 'Home', href: '/' },
        { name: 'Shop', href: '/shop' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/about#contact' },
      ]
    },
   
    {
      title: 'CONNECT WITH US',
      links: [
        { name: 'Instagram', href: '#' },
        { name: 'Facebook', href: '#' },
        { name: 'Pinterest', href: '#' },
        { name: 'Email', href: '#' },
      ]
    },
  ];

  return (
    <motion.footer 
      className="bg-black text-white py-12 px-6"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto">
        {/* Brand and Tagline */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-2">
            <img src="/logo.png" alt="KAMTI" className="h-12 w-auto filter brightness-0 invert" />
          </div>
          <p className="text-white/70 text-sm">Your Perfect Jewellery</p>
        </div>

        {/* Footer Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {footerSections.map((section, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xs font-medium tracking-wider mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      href={link.href} 
                      className="text-white/70 hover:text-white text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="border-t border-white/20 pt-8 text-center">

          
          {/* Copyright */}
          <div className="text-white/50 text-xs">
            <p>© {new Date().getFullYear()} KALA Jewellery. All rights reserved.</p>
          </div>
        </div>
      </div>
    </motion.footer>
  );
} 