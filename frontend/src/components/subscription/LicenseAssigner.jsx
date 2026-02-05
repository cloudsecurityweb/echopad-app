import { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

function LicenseAssigner({ user, licenses, productCode, onAssign }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLicenseId, setSelectedLicenseId] = useState('');
    const [loading, setLoading] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

    const buttonRef = useRef(null);
    const dropdownRef = useRef(null);

    // Filter licenses for current product
    const availableLicenses = useMemo(() => {
        return licenses.filter(l => l.productId === productCode && l.status === 'active');
    }, [licenses, productCode]);

    // Reset state and calculate position when opening
    useEffect(() => {
        if (isOpen && buttonRef.current) {
            setSelectedLicenseId('');
            setLoading(false);

            // Calculate position
            const rect = buttonRef.current.getBoundingClientRect();
            const DROPDOWN_WIDTH = 288; // w-72 = 18rem = 288px
            const GAP = 8; // small gap

            // align right edge of dropdown with right edge of button
            let left = rect.right - DROPDOWN_WIDTH;
            let top = rect.bottom + GAP;

            // Basic viewport boundary check (simple)
            if (left < 10) left = rect.left; // flip to align left if it goes offscreen left (unlikely here but good safety)

            // Check bottom edge
            const DROPDOWN_HEIGHT_EST = 300; // max-height 60 + header/footer
            if (top + DROPDOWN_HEIGHT_EST > window.innerHeight) {
                top = rect.top - DROPDOWN_HEIGHT_EST - GAP; // flip up
            }

            setDropdownPosition({ top, left });
        }
    }, [isOpen]);

    // Close on scroll or resize to prevent floating issues
    useEffect(() => {
        if (!isOpen) return;
        const handleScroll = () => setIsOpen(false);
        window.addEventListener('scroll', handleScroll, true);
        window.addEventListener('resize', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('resize', handleScroll);
        };
    }, [isOpen]);


    const handleSave = async () => {
        if (!selectedLicenseId) return;

        setLoading(true);
        try {
            await onAssign(user.id, selectedLicenseId);
            setIsOpen(false);
        } catch (error) {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-cyan-500 shadow-sm"
            >
                Assign License
            </button>

            {isOpen && createPortal(
                <div className="fixed inset-0 z-[9999] isolate">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-transparent"
                        onClick={() => setIsOpen(false)}
                    ></div>

                    {/* Dropdown Popover */}
                    <div
                        ref={dropdownRef}
                        className="fixed w-72 bg-white rounded-xl shadow-2xl border border-gray-100/50 ring-1 ring-black/5 overflow-hidden flex flex-col origin-top animate-in fade-in zoom-in-95 duration-100 ease-out"
                        style={{
                            top: dropdownPosition.top,
                            left: dropdownPosition.left,
                            maxHeight: '400px'
                        }}
                    >
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/80 backdrop-blur-sm flex-none">
                            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <svg className="w-4 h-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                </svg>
                                Select License
                            </h4>
                        </div>

                        {/* License List */}
                        <div className="p-2 overflow-y-auto flex-1 min-h-0 bg-white">
                            {availableLicenses.length === 0 ? (
                                <div className="text-center py-6 px-4">
                                    <div className="mx-auto w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <p className="text-xs text-gray-500">No licenses available for this product.</p>
                                </div>
                            ) : (
                                availableLicenses.map((license) => {
                                    const totalSeats = license.totalSeats ?? license.seats ?? 0;
                                    const usedSeats = license.usedSeats ?? 0;
                                    const isUnlimited = license.licenseType === 'unlimited';
                                    const remainingSeats = isUnlimited ? 'Unlimited' : Math.max(0, totalSeats - usedSeats);
                                    const isFull = !isUnlimited && remainingSeats <= 0;

                                    return (
                                        <label
                                            key={license.id}
                                            className={`group flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border ${isFull
                                                ? 'opacity-60 cursor-not-allowed bg-gray-50 border-transparent'
                                                : selectedLicenseId === license.id
                                                    ? 'bg-cyan-50/50 border-cyan-200 shadow-sm'
                                                    : 'hover:bg-gray-50 border-transparent hover:border-gray-100'
                                                }`}
                                        >
                                            <div className="relative flex items-center h-5">
                                                <input
                                                    type="radio"
                                                    name={`license-${user.id}`}
                                                    value={license.id}
                                                    checked={selectedLicenseId === license.id}
                                                    onChange={() => setSelectedLicenseId(license.id)}
                                                    disabled={isFull}
                                                    className="peer sr-only" // Hide default radio
                                                />
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${selectedLicenseId === license.id
                                                    ? 'border-cyan-500 bg-cyan-500'
                                                    : 'border-gray-300 group-hover:border-cyan-400'
                                                    }`}>
                                                    <div className="w-1.5 h-1.5 bg-white rounded-full mx-auto" />
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0 -mt-0.5">
                                                <div className={`text-sm font-medium transition-colors ${selectedLicenseId === license.id ? 'text-cyan-900' : 'text-gray-900'}`}>
                                                    {license.licenseType || 'Standard License'}
                                                </div>
                                                <div className="text-xs mt-1 flex items-center gap-1.5">
                                                    {isFull ? (
                                                        <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded text-[10px] font-medium border border-amber-100">
                                                            Full ({totalSeats}/{totalSeats})
                                                        </span>
                                                    ) : (
                                                        <>
                                                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${isUnlimited
                                                                ? 'bg-purple-50 text-purple-700 border-purple-100'
                                                                : 'bg-green-50 text-green-700 border-green-100'
                                                                }`}>
                                                                {isUnlimited ? '∞' : remainingSeats} left
                                                            </span>
                                                            <span className="text-gray-400">of {isUnlimited ? 'Unlimited' : totalSeats} Seats</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </label>
                                    );
                                })
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center flex-none">
                            <span className="text-[10px] text-gray-400 font-medium">
                                {selectedLicenseId ? '1 license selected' : 'Select a license'}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200/50 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={!selectedLicenseId || loading}
                                    className="px-4 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-cyan-500/20 active:scale-95"
                                >
                                    Save
                                </button>
                            </div>
                        </div>

                        {/* Loading Overlay */}
                        {loading && (
                            <div className="absolute inset-0 bg-white/90 backdrop-blur-[1px] flex flex-col items-center justify-center z-30 animate-in fade-in duration-200">
                                <div className="relative w-8 h-8">
                                    <div className="absolute inset-0 border-2 border-gray-100 rounded-full"></div>
                                    <div className="absolute inset-0 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                                <span className="text-xs font-medium text-cyan-700 mt-2">Assigning License...</span>
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}

export default LicenseAssigner;
