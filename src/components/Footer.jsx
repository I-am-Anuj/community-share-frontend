import React, { useState } from 'react';
import { ChevronDown, Clock, Mail, HelpCircle, ShieldAlert, MessageCircleQuestion } from 'lucide-react';

export default function HelpSupport() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const faqs = [
    {
      question: "How does the Two-Factor return verification handshake work?",
      answer: "The handshake is our proprietary security protocol. When returning an item, both parties scan a unique QR code generated on the borrower's app. Once both signals match, the 'Return Receipt' is encrypted and stored on our community ledger, instantly releasing any held deposits."
    },
    {
      question: "What happens if a tool is returned damaged or past the lease deadline?",
      answer: "We maintain a Community Protection Fund for such cases. If a tool is damaged, a Moderator will review photos from both the checkout and return phases. Late returns incur a small daily convenience fee that is automatically credited to the lender's account."
    },
    {
      question: "Are there any listing fees inside the closed Gated Community Lockers?",
      answer: "Listing items is always 100% free for community members. A nominal service fee of 2% is only applied during successful transactions to maintain the physical locker infrastructure and digital platform security."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto w-full flex flex-col gap-8 p-2 text-sm text-gray-700">
      
      <section className="relative py-12 px-8 rounded-3xl bg-gradient-to-br from-[#fbf2e9] to-[#f5ece4] overflow-hidden border border-[#eae1d8] shadow-xs">
        <div className="absolute top-0 right-0 opacity-10 translate-x-10 -translate-y-6 text-[#b85c26] select-none pointer-events-none">
          <MessageCircleQuestion size={240} />
        </div>
        <div className="relative z-10 max-w-2xl space-y-4">
          <h1 className="text-3xl font-black text-[#42240d] tracking-tight">How can we help you today?</h1>
          <p className="text-sm md:text-base text-[#50443d] font-medium leading-relaxed">
            Browse through our comprehensive community knowledge logs below or launch a direct communication tunnel straight to active peer moderation networks.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
        
        <section className="space-y-4 bg-white border border-[#eae1d8] rounded-2xl p-8 shadow-xs">
          <div className="flex items-center gap-2.5 mb-4 border-b border-gray-100 pb-4">
            <HelpCircle size={20} className="text-[#b85c26]" />
            <h2 className="text-base font-bold text-[#42240d] uppercase tracking-wider">Frequently Asked Questions</h2>
          </div>
          
          <div className="divide-y divide-[#d4c3b9]/30">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className="py-5 first:pt-0 last:pb-0">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex justify-between items-center text-left cursor-pointer font-bold text-[#1f1b16] hover:text-[#9a460f] transition-colors gap-6 py-1"
                  >
                    <span className="text-sm md:text-base tracking-tight">{faq.question}</span>
                    <ChevronDown className={`text-gray-400 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-[#9a460f]' : ''}`} size={18} />
                  </button>
                  <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-60 mt-3 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-[#50443d] text-sm leading-relaxed bg-[#fff8f3] p-5 rounded-xl border border-[#eae1d8] font-medium shadow-2xs">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <aside className="bg-white border border-[#eae1d8] p-6 rounded-2xl shadow-xs flex flex-col gap-5">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-[#42240d] tracking-tight flex items-center gap-1.5">
              <ShieldAlert size={18} className="text-[#b85c26]" /> Need more help?
            </h2>
            <p className="text-xs text-[#50443d] leading-relaxed">
              Our community handlers are standing by to mediate sharing logs or handle escrow locker disputes.
            </p>
          </div>
          
          <div className="border-t border-b border-gray-100 py-3.5 space-y-1">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Direct Support Email</p>
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-[#9a460f]" />
              <a href="mailto:support@communityshare.org" className="text-[#9a460f] font-bold text-sm hover:underline">
                support@communityshare.org
              </a>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 pt-1">
            <button className="w-full bg-[#42240d] text-white text-center py-3 rounded-xl font-bold hover:bg-[#5c3a21] transition-all shadow-xs cursor-pointer text-xs">
              Contact a Moderator
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-400 justify-center bg-[#fff8f3] py-2 rounded-xl border border-[#eae1d8]/60 mt-2">
            <Clock size={14} className="text-gray-400" />
            <span className="font-medium">Average Response: &lt; 4 hours</span>
          </div>
        </aside>

      </div>

      <footer className="w-full bg-[#fff8f3] border-t border-[#d4c3b9]/20 py-6 mt-12 text-xs text-[#50443d]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="text-gray-400 font-medium">
            <span>&copy; 2026 Anuj Kumar. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <a 
              href="mailto:support@communityshare.org" 
              className="flex items-center gap-1.5 text-gray-500 hover:text-[#b85c26] transition-colors"
            >
              <Mail size={14} className="shrink-0" />
              <span>support@communityshare.org</span>
            </a>
            
            <a 
              href="https://instagram.com/iamanujxyz" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1.5 text-gray-500 hover:text-[#b85c26] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
              <span>@iamanujxyz</span>
            </a>
          </div>

        </div>
      </footer>

    </div>
  );
}