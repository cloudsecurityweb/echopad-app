import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * BuyNowCTA Component
 * 
 * A reusable "Buy Now" button that:
 * - Checks if user is authenticated
 * - Shows sign-in prompt if not authenticated
 * - Redirects to Stripe Payment Link if authenticated
 * 
 * @param {Object} props
 * @param {string} props.stripePaymentLink - Stripe Payment Link URL
 * @param {string} props.productName - Product name for display
 * @param {string} props.size - Button size: 'sm', 'md', 'lg' (default: 'md')
 * @param {boolean} props.fullWidth - Whether button should be full width
 * @param {string} props.variant - Button variant: 'primary', 'secondary' (default: 'primary')
 */
function BuyNowCTA({ 
  stripePaymentLink, 
  productName = 'this product',
  size = 'md',
  fullWidth = false,
  variant = 'primary'
}) {
  const { isAuthenticated } = useAuth();

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white',
    secondary: 'bg-white border-2 border-cyan-500 text-cyan-600 hover:bg-cyan-50',
  };

  const handleBuyClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      // Redirect to sign-in page, then back to current page after sign-in
      const currentPath = window.location.pathname;
      window.location.href = `/sign-in?redirect=${encodeURIComponent(currentPath)}`;
      return;
    }

    // If authenticated, allow navigation to Stripe Payment Link
    // The link will open in the same window (or you can use target="_blank" for new tab)
  };

  if (!isAuthenticated) {
    return (
      <Link
        to={`/sign-in?redirect=${encodeURIComponent(window.location.pathname)}`}
        className={`
          inline-flex items-center justify-center gap-2
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          rounded-lg font-semibold shadow-lg
          transition-all hover:scale-105 active:scale-95
          ${fullWidth ? 'w-full' : ''}
        `}
      >
        <i className="bi bi-lock-fill"></i>
        Sign In to Purchase
      </Link>
    );
  }

  return (
    <a
      href={stripePaymentLink}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleBuyClick}
      className={`
        inline-flex items-center justify-center gap-2
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-lg font-semibold shadow-lg
        transition-all hover:scale-105 active:scale-95
        ${fullWidth ? 'w-full' : ''}
      `}
    >
      <i className="bi bi-cart-fill"></i>
      Buy Now
    </a>
  );
}

export default BuyNowCTA;
