import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';

export default function NotFound() {
    // Ensure instant scroll to top
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <Navigation />

            <main className="relative overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-blue-50">
                {/* Decorative blurred gradients */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />

                <section className="relative min-h-[100vh] flex items-center justify-center px-4">
                    <div className="max-w-xl w-full text-center bg-white rounded-3xl border-2 border-gray-200 shadow-xl p-10">

                        {/* Animated AI pulse */}
                        <div className="flex justify-center mb-6">
                            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">

                                {/* Slow scan ring */}
                                <div className="absolute inset-0 rounded-full border-2 border-white/40 animate-spin-slow"></div>

                                {/* Search icon */}
                                <i className="bi bi-search text-white text-3xl relative z-10"></i>

                                {/* Question mark badge */}
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow">
                                    <span className="text-blue-600 text-sm font-bold">?</span>
                                </div>
                            </div>
                        </div>


                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Page not found
                        </h1>

                        <p className="text-gray-600 text-lg mb-8">
                            The page you’re looking for doesn’t exist or may have been moved.
                            Let’s get you back to something useful.
                        </p>

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium shadow-lg hover:from-cyan-400 hover:to-blue-500 transition-all hover:shadow-cyan-500/40"
                            >
                                <i className="bi bi-house-fill"></i>
                                Go to Home
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
