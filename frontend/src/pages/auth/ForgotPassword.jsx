import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthPageHeader from '../../components/auth/AuthPageHeader';
import usePageTitle from '../../hooks/usePageTitle';

function ForgotPassword() {
    const PageTitle = usePageTitle('Forgot Password');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState(null); // 'success' | 'error' | null
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    // RFC 5322 inspired email regex (matching SignIn.jsx)
    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
        return emailRegex.test(email.trim());
    };

    const handleChange = (e) => {
        const { value } = e.target;
        setEmail(value);

        // Clear error when input becomes valid
        if (errors.email && value.trim() && validateEmail(value)) {
            setErrors({});
        }
    };

    const handleBlur = () => {
        if (email.trim() && !validateEmail(email)) {
            setErrors({ email: 'Enter a valid email address' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset status
        setStatus(null);
        setMessage('');
        const newErrors = {};

        // Validate email
        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Enter a valid email address';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        setIsLoading(true);

        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://echopad-app-service-bwd0bqd7g7ehb5c7.westus2-01.azurewebsites.net';
            const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email.trim() }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setStatus('success');
                setMessage(data.message || 'If an account exists for this email, a password reset link has been sent.');
            } else {
                setStatus('error');
                setMessage(data.message || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            setStatus('error');
            setMessage('Failed to send reset email. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {PageTitle}
            <div className="min-h-screen bg-white">
                <AuthPageHeader />
                <main className="flex items-center justify-center py-4 min-h-[calc(100vh-4rem)]">
                    <section className="w-full max-w-md px-4">
                        <div className="text-center">
                            <div className="mb-4">
                                <svg className="h-16 w-16 text-cyan-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
                            <p className="text-gray-600 mb-6">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>

                            {status === 'success' ? (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                                    <p className="text-green-800">{message}</p>
                                    <p className="text-sm text-green-700 mt-2">
                                        Check your inbox and spam folder for the reset link.
                                    </p>
                                </div>
                            ) : status === 'error' ? (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                    <p className="text-red-800">{message}</p>
                                </div>
                            ) : null}

                            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        disabled={isLoading || status === 'success'}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${errors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="your.email@example.com"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600 text-left">{errors.email}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || status === 'success'}
                                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </span>
                                    ) : status === 'success' ? (
                                        'Email Sent!'
                                    ) : (
                                        'Send Reset Link'
                                    )}
                                </button>
                            </form>

                            <div className="mt-6 space-y-2">
                                <Link
                                    to="/sign-in"
                                    className="block text-sm text-cyan-600 hover:text-cyan-700 font-medium"
                                >
                                    Back to Sign In
                                </Link>
                                <p className="block text-sm text-gray-600">
                                    Don't have an account?{' '}
                                    <Link
                                        to="/sign-up"
                                        className="text-cyan-600 hover:text-cyan-700 font-medium"
                                    >
                                        Sign up
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}

export default ForgotPassword;
