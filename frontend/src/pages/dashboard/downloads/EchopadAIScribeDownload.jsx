import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollAnimations } from '../../../hooks/useAnimation';

const EchopadAIScribeDownload = () => {
    useScrollAnimations();
    const [activeTab, setActiveTab] = useState('mac');

    const navigate = useNavigate();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0 space-y-20">
            {/* Back Button */}
            <button
                onClick={() => navigate('/dashboard/productsowned')}
                className="group flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer mb-[0rem]"
            >
                <i className="bi bi-arrow-left group-hover:-translate-x-1 transition-transform"></i>
                <span className="font-medium">Back to My Products</span>
            </button>

            {/* 1. Hero Section */}
            <section className="text-center space-y-8 animate-fadeIn pt-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-100 rounded-full text-cyan-700 text-sm font-medium mb-4">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                    v1.0.0 Now Available
                </div>

                <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight mb-6">
                    Real-time clinical <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
                        documentation
                    </span>
                </h1>

                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
                    Echopad AI Scribe converts live clinical conversations into structured medical documentation — <span className="text-gray-900 font-medium">securely, accurately, and instantly</span>. Zero manual typing.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto pt-8 pb-8">
                    {/* macOS Card */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group text-left">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-50 rounded-bl-full -mr-10 -mt-10 opacity-50 group-hover:scale-110 transition-transform"></div>
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-gray-900 rounded-xl text-white shadow-lg shadow-gray-200">
                                    <i className="bi bi-apple text-2xl"></i>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">macOS</h3>
                                    <p className="text-sm text-gray-500">For macOS 12 (Monterey) or later</p>
                                </div>
                            </div>

                            <div className="space-y-3 mt-auto">
                                <button className="w-full py-3.5 px-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold flex items-center justify-between group/btn shadow-lg shadow-gray-200 cursor-pointer">
                                    <span className="flex flex-col items-start">
                                        <span>Download for Apple Silicon</span>
                                        <span className="text-[10px] font-normal text-gray-400">M1 / M2 / M3 / M4 / M5 Chips</span>
                                    </span>
                                    <i className="bi bi-cpu text-lg text-gray-400 group-hover/btn:text-white transition-colors"></i>
                                </button>

                                <button className="w-full py-3 px-4 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm flex items-center justify-between group/intel cursor-pointer">
                                    <span className="flex flex-col items-start">
                                        <span>Download for Intel Chip</span>
                                        <span className="text-[10px] font-normal text-gray-500">x86_64 Architecture</span>
                                    </span>
                                    <i className="bi bi-hdd-network text-lg text-gray-400 group-hover/intel:text-gray-600 transition-colors"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Windows Card */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group text-left">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-blue-100 rounded-bl-full -mr-10 -mt-10 opacity-50 group-hover:scale-110 transition-transform"></div>
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-100">
                                    <i className="bi bi-windows text-2xl"></i>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">Windows</h3>
                                    <p className="text-sm text-gray-500">For Windows 10 & 11</p>
                                </div>
                            </div>

                            <div className="space-y-3 mt-auto">
                                <button className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all font-semibold flex items-center justify-between group/btn shadow-lg shadow-blue-100 cursor-pointer">
                                    <span className="flex flex-col items-start">
                                        <span>Download for 64-bit</span>
                                        <span className="text-[10px] font-normal text-blue-100">Recommended</span>
                                    </span>
                                    <i className="bi bi-download text-lg text-blue-100 group-hover/btn:text-white transition-colors"></i>
                                </button>

                                <button className="w-full py-3 px-4 bg-blue-50 text-blue-900 rounded-xl hover:bg-blue-100 transition-colors font-medium text-sm flex items-center justify-between group/32bit cursor-pointer">
                                    <span className="flex flex-col items-start">
                                        <span>Download for 32-bit</span>
                                        <span className="text-[10px] font-normal text-blue-600/70">x86 Architecture</span>
                                    </span>
                                    <i className="bi bi-display text-lg text-blue-300 group-hover/32bit:text-blue-500 transition-colors"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-gray-500">
                    Secure & HIPAA Ready • Cancel anytime
                </p>
            </section>

            {/* 2. System Requirements Tabs */}
            <section className="bg-gray-50 rounded-3xl p-8 md:p-12 animate-on-scroll">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">System Requirements</h2>
                    <p className="text-gray-600">Ensure your device is ready for Echopad AI Scribe</p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-center mb-8">
                        <div className="bg-white p-1 rounded-xl border border-gray-200 inline-flex">
                            <button
                                onClick={() => setActiveTab('mac')}
                                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'mac' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <i className="bi bi-apple"></i> macOS
                            </button>
                            <button
                                onClick={() => setActiveTab('win')}
                                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'win' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <i className="bi bi-windows"></i> Windows
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                        {activeTab === 'mac' ? (
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                        <i className="bi bi-check-circle-fill text-green-500"></i> Minimum Specs
                                    </h3>
                                    <ul className="space-y-3 text-sm text-gray-600">
                                        <li className="flex gap-3">
                                            <span className="font-medium text-gray-900 w-24">OS:</span>
                                            macOS 12 (Monterey) or later
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="font-medium text-gray-900 w-24">Processor:</span>
                                            Apple Silicon (M1/M2/M3) or Intel
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="font-medium text-gray-900 w-24">RAM:</span>
                                            8 GB minimum
                                        </li>
                                    </ul>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                        <i className="bi bi-lightning-charge-fill text-amber-500"></i> Recommended
                                    </h3>
                                    <ul className="space-y-3 text-sm text-gray-600">
                                        <li className="flex gap-3">
                                            <span className="font-medium text-gray-900 w-24">OS:</span>
                                            macOS 14 (Sonoma)
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="font-medium text-gray-900 w-24">Processor:</span>
                                            Apple Silicon M1 or better
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="font-medium text-gray-900 w-24">Internet:</span>
                                            Stable broadband connection
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                        <i className="bi bi-check-circle-fill text-green-500"></i> Minimum Specs
                                    </h3>
                                    <ul className="space-y-3 text-sm text-gray-600">
                                        <li className="flex gap-3">
                                            <span className="font-medium text-gray-900 w-24">OS:</span>
                                            Windows 10 (64-bit)
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="font-medium text-gray-900 w-24">Processor:</span>
                                            Intel Core i3 or AMD Ryzen 5
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="font-medium text-gray-900 w-24">RAM:</span>
                                            8 GB minimum
                                        </li>
                                    </ul>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                        <i className="bi bi-lightning-charge-fill text-amber-500"></i> Recommended
                                    </h3>
                                    <ul className="space-y-3 text-sm text-gray-600">
                                        <li className="flex gap-3">
                                            <span className="font-medium text-gray-900 w-24">OS:</span>
                                            Windows 11
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="font-medium text-gray-900 w-24">Processor:</span>
                                            Intel Core i5 or AMD Ryzen 7
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="font-medium text-gray-900 w-24">Internet:</span>
                                            Stable broadband connection
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* 3. FAQ Accordion */}
            <section className="max-w-3xl mx-auto animate-on-scroll">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {[
                        { q: "Does Echopad AI Scribe record audio?", a: "Audio is captured only during an active scribing session and processed securely to generate clinical documentation. No audio is stored permanently." },
                        { q: "Can clinicians edit the generated notes?", a: "Yes. All generated notes are fully editable before being finalized and exported to your EHR." },
                        { q: "Is internet required?", a: "Yes. A secure internet connection is required to process AI models and generate structured clinical documentation." },
                        { q: "Is it HIPAA compliant?", a: "Yes. Echopad AI Scribe is built with healthcare security standards, including encrypted data in transit and at rest, and role-based access controls." }
                    ].map((faq, i) => (
                        <details key={i} className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                                <h3 className="font-semibold text-gray-900">{faq.q}</h3>
                                <span className="transform group-open:rotate-180 transition-transform text-gray-400">
                                    <i className="bi bi-chevron-down"></i>
                                </span>
                            </summary>
                            <div className="px-6 pb-6 text-gray-600 leading-relaxed animate-fadeIn">
                                {faq.a}
                            </div>
                        </details>
                    ))}
                </div>
            </section>

            {/* 4. Final CTA */}
            <section className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 text-center text-white animate-on-scroll overflow-hidden relative">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-cyan-500 rounded-full blur-3xl opacity-20"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20"></div>

                <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                    <h2 className="text-3xl md:text-4xl font-bold">Ready to transform your documentation?</h2>
                    <p className="text-gray-300 text-lg">
                        Join thousands of clinicians saving 2+ hours daily with Echopad AI Scribe.
                    </p>
                    <div className="flex justify-center">
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="px-10 py-4 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-colors font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-300 cursor-pointer flex items-center gap-3"
                        >
                            <span>Start Your Free Download</span>
                            <i className="bi bi-arrow-up-circle text-blue-600"></i>
                        </button>
                    </div>
                    <p className="text-xs text-gray-400">
                        By downloading, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </section>

        </div>
    );
};

export default EchopadAIScribeDownload;
