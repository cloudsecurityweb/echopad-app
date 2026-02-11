import { useState } from 'react';
import { Link } from 'react-router-dom';

function TermsAgreementModal({ isOpen, onClose, onConfirm, providerName }) {
    const [isChecked, setIsChecked] = useState(false);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in-up">
                <div className="text-center mb-6">
                    <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Terms of Service</h2>
                    <p className="text-gray-600 mt-2 text-sm">
                        Please agree to our terms to continue with {providerName} sign up.
                    </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100">
                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                id="modal-terms"
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => setIsChecked(e.target.checked)}
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded cursor-pointer"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="modal-terms" className="font-medium text-gray-700 cursor-pointer">
                                I agree to the Terms
                            </label>
                            <p className="text-gray-500 mt-1">
                                By ticking this box, you agree to our{' '}
                                <Link to="/terms-of-service" className="text-cyan-600 hover:text-cyan-700 hover:underline" target="_blank">
                                    Terms of Service
                                </Link>
                                {' '}and{' '}
                                <Link to="/privacy-policy" className="text-cyan-600 hover:text-cyan-700 hover:underline" target="_blank">
                                    Privacy Policy
                                </Link>
                                .
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 mt-8">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors font-medium text-sm cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={!isChecked}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all font-medium text-sm cursor-pointer"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TermsAgreementModal;
