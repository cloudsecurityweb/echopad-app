import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollAnimations } from '../../../hooks/useAnimation';
import http from '../../../api/http';
import { getAiScribeVersion } from '../../../api/downloads.api';

const DOWNLOAD_MAC_URL = '/api/download/ai-scribe/mac';
const DOWNLOAD_DESKTOP_URL = '/api/download/ai-scribe/desktop';
const DEFAULT_MAC_FILENAME = 'Echopad.dmg';
const DEFAULT_DESKTOP_FILENAME = 'Echopad-Setup.exe';

function getFilenameFromDisposition(contentDisposition) {
    if (!contentDisposition) return null;
    const match = /filename="?([^";\n]+)"?/i.exec(contentDisposition);
    return match ? match[1].trim() : null;
}

const EchopadAIScribeDownload = () => {
    useScrollAnimations();
    const [activeTab, setActiveTab] = useState('mac');
    const [downloadState, setDownloadState] = useState('idle'); // 'idle' | 'mac' | 'desktop'
    const [downloadError, setDownloadError] = useState(null);
    const [versionManifest, setVersionManifest] = useState(null); // { desktop: { version, filename }, mac: { version, filename } }
    const [versionLoading, setVersionLoading] = useState(true);
    const navigate = useNavigate();

    const fetchVersions = (bypassCache = false) => {
        setVersionLoading(true);
        const url = bypassCache ? '/api/download/ai-scribe/version?refresh=1' : '/api/download/ai-scribe/version';
        http.get(url)
            .then((res) => res.data && setVersionManifest(res.data))
            .catch(() => setVersionManifest(null))
            .finally(() => setVersionLoading(false));
    };

    useEffect(() => {
        fetchVersions();
    }, []);

    const triggerBlobDownload = (blob, filename) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const handleDownload = async (platform) => {
        setDownloadError(null);
        setDownloadState(platform);
        const isMac = platform === 'mac';
        const manifest = isMac ? versionManifest?.mac : versionManifest?.desktop;
        const versionParam = manifest?.version ? `?version=${encodeURIComponent(manifest.version)}` : '';
        const url = (isMac ? DOWNLOAD_MAC_URL : DOWNLOAD_DESKTOP_URL) + versionParam;
        const defaultFilename = isMac
            ? (versionManifest?.mac?.filename || DEFAULT_MAC_FILENAME)
            : (versionManifest?.desktop?.filename || DEFAULT_DESKTOP_FILENAME);
        try {
            const response = await http.get(url, { responseType: 'blob' });
            const disposition = response.headers['content-disposition'];
            const filename = getFilenameFromDisposition(disposition) || defaultFilename;
            triggerBlobDownload(response.data, filename);
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                setDownloadError('Please sign in to download.');
            } else if (err.response?.status >= 500) {
                setDownloadError('Download unavailable. Please try again later.');
            } else {
                setDownloadError('Download failed. Please try again.');
            }
            if (err.response?.data instanceof Blob) {
                try {
                    const text = await err.response.data.text();
                    const json = JSON.parse(text);
                    if (json?.message) setDownloadError(json.message);
                } catch (_) { /* keep existing message */ }
            }
        } finally {
            setDownloadState('idle');
        }
    };

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
                <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-100 rounded-full text-cyan-700 text-sm font-medium">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </span>
                        {versionLoading ? 'Checking for updates…' : versionManifest?.mac?.version ? `macOS v${versionManifest.mac.version} Now Available` : 'macOS —'}
                    </span>
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-200 rounded-full text-gray-700 text-sm font-medium">
                        <i className="bi bi-windows text-blue-600"></i>
                        {versionLoading ? 'Checking for updates…' : versionManifest?.desktop?.version ? `Windows v${versionManifest.desktop.version} Now Available` : 'Windows —'}
                    </span>
                    {!versionLoading && (
                        <button
                            type="button"
                            onClick={() => fetchVersions(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors cursor-pointer"
                            title="Fetch newest versions from server"
                        >
                            <i className="bi bi-arrow-clockwise"></i>
                            Refresh versions
                        </button>
                    )}
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

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 pb-8">
                    <button
                        onClick={() => handleDownload('mac')}
                        disabled={downloadState !== 'idle'}
                        className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 font-semibold flex items-center justify-center gap-3 shadow-lg shadow-cyan-100/50 hover:shadow-cyan-200 hover:-translate-y-1 cursor-pointer group disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                        <i className="bi bi-apple text-xl group-hover:scale-110 transition-transform"></i>
                        <div className="text-left">
                            <div className="text-xs font-normal opacity-90">Download for</div>
                            <div className="text-sm font-bold">{downloadState === 'mac' ? 'Downloading…' : versionManifest?.mac?.version ? `macOS v${versionManifest.mac.version}` : 'macOS'}</div>
                        </div>
                    </button>

                    <button
                        onClick={() => handleDownload('desktop')}
                        disabled={downloadState !== 'idle'}
                        className="px-8 py-4 bg-white text-gray-800 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 font-semibold flex items-center justify-center gap-3 shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer group disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                        <i className="bi bi-windows text-xl text-blue-600 group-hover:scale-110 transition-transform"></i>
                        <div className="text-left">
                            <div className="text-xs font-normal text-gray-500">Download for</div>
                            <div className="text-sm font-bold">{downloadState === 'desktop' ? 'Downloading…' : versionManifest?.desktop?.version ? `Windows v${versionManifest.desktop.version}` : 'Windows'}</div>
                        </div>
                    </button>
                </div>

                {downloadError && (
                    <p className="text-sm text-red-600" role="alert">
                        {downloadError}
                    </p>
                )}

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
                                            Apple Silicon M1 Pro or better
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
                                            Intel Core i5 or AMD Ryzen 5
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
                                            Intel Core i7 or AMD Ryzen 7
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
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => handleDownload('mac')}
                            disabled={downloadState !== 'idle'}
                            className="px-8 py-3 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-colors font-semibold shadow-lg cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {downloadState === 'mac' ? 'Downloading…' : versionManifest?.mac?.version ? `Download for macOS (v${versionManifest.mac.version})` : 'Download for macOS'}
                        </button>
                        <button
                            onClick={() => handleDownload('desktop')}
                            disabled={downloadState !== 'idle'}
                            className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors font-semibold shadow-lg border border-transparent cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {downloadState === 'desktop' ? 'Downloading…' : versionManifest?.desktop?.version ? `Download for Windows (v${versionManifest.desktop.version})` : 'Download for Windows'}
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
