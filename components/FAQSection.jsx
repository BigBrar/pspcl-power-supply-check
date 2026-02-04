import React, { useState } from 'react';

const FAQSection = ({ district, division, subdivision }) => {
    // Dynamic Location Name
    const locationName = district?.label || 'Punjab';

    // State to track which question is expanded (null = all closed)
    const [openIndex, setOpenIndex] = useState(null);

    const toggleQuestion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    // Dynamic Answers
    const outageReasonAnswer = `Power cuts in ${locationName} are usually caused by scheduled grid maintenance, technical faults, or local load shedding. You can check the specific reason and estimated restoration time for your area using our live tracker above.`;

    const helplineAnswer = subdivision
        ? `For immediate complaints in ${subdivision.label}, call 1912. You can also contact the Junior Engineer (JE) for ${subdivision.label} directly if their number is listed on your bill.`
        : `For electricity complaints in ${locationName}, dial the 24x7 PSPCL helpline at 1912.`;

    // FAQ Data Array
    const faqs = [
        {
            question: "How can I check the live power cut status in my area?",
            answer: (
                <>
                    You can check the live PSPCL power cut status by selecting your District, Division, and Subdivision on
                    <strong className="text-amber-200"> Bijli Punjab</strong>. Our real-time tracker provides the latest updates
                    on scheduled maintenance and unscheduled outages across Punjab.
                </>
            )
        },
        {
            question: "What is the PSPCL customer care number for power complaints?",
            answer: helplineAnswer
        },
        {
            question: `Why is there a power cut in ${locationName} today?`,
            answer: outageReasonAnswer
        }
    ];

    return (
        <div className="w-full max-w-4xl mx-auto mt-20 px-4 pb-16 text-left">
            <h2 className="text-2xl font-bold text-amber-400 mb-8 text-center border-b border-amber-400/20 pb-4">
                Frequently Asked Questions
            </h2>

            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        onClick={() => toggleQuestion(index)}
                        className="bg-[#1e2337] rounded-xl border border-white/5 shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:border-amber-400/30"
                    >
                        {/* Question Header */}
                        <div className="p-5 flex justify-between items-center bg-[#252b42]">
                            <h3 className="text-lg font-semibold text-gray-200 flex-1 pr-4">
                                {faq.question}
                            </h3>
                            <button className="text-amber-400 font-bold text-xl">
                                {openIndex === index ? '−' : '+'}
                            </button>
                        </div>

                        {/* Expandable Answer Body */}
                        <div
                            className={`transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                        >
                            <p className="p-5 pt-2 text-gray-400 leading-relaxed border-t border-white/5 bg-[#1e2337]">
                                {faq.answer}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQSection;
