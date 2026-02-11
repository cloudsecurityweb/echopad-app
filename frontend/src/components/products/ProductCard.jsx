import { Link } from 'react-router-dom';

function ProductCard({ icon, title, description, link, featured = false, comingSoon = false }) {
  // Check if link is an internal route (starts with /) or external
  const isInternalLink = link && link.startsWith('/') && !link.startsWith('http');

  const linkContent = (
    <>
      Learn More
      <i className="bi bi-arrow-right group-hover:translate-x-1 transition-transform"></i>
    </>
  );

  return (
    <div className={`glass-card rounded-2xl p-2.5 md:p-3 lg:p-4 xl:p-5 2xl:p-6 hover-lift relative overflow-hidden group shadow-sm ${featured ? 'ring-2 ring-cyan-500/50' : ''} ${comingSoon ? 'opacity-90' : ''}`}>
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative z-10">
        <div className={`w-9 h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-16 rounded-xl flex items-center justify-center mb-1.5 md:mb-2 lg:mb-3 xl:mb-4 2xl:mb-5 transition-transform group-hover:scale-110 group-hover:rotate-6 ${featured ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50' : comingSoon ? 'bg-gradient-to-br from-gray-200 to-gray-300' : 'bg-gradient-to-br from-gray-100 to-gray-200'}`}>
          <i className={`bi ${icon} ${featured ? 'text-white' : 'text-cyan-600'} text-base md:text-lg lg:text-xl xl:text-2xl`}></i>
        </div>
        <h4 className="text-sm md:text-base lg:text-lg xl:text-xl font-bold text-gray-900 mb-1 md:mb-1.5 lg:mb-2 xl:mb-3 group-hover:text-cyan-600 transition-colors">{title}</h4>
        <p className="text-xs md:text-sm lg:text-base text-gray-600 mb-2 md:mb-3 lg:mb-4 xl:mb-5 2xl:mb-6 leading-relaxed">{description}</p>
        {!comingSoon ? (
          isInternalLink ? (
            <Link
              to={link}
              className="inline-flex items-center gap-1.5 md:gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-2.5 md:px-3 lg:px-4 xl:px-5 py-1 md:py-1.5 lg:py-2 xl:py-2.5 rounded-lg hover:from-cyan-400 hover:to-blue-500 font-medium text-xs md:text-sm lg:text-base group/link transition-all hover:scale-105 shadow-lg"
              aria-label={`Learn more about ${title}`}
            >
              {linkContent}
            </Link>
          ) : (
            <a
              href={link}
              className="inline-flex items-center gap-1.5 md:gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-2.5 md:px-3 lg:px-4 xl:px-5 py-1 md:py-1.5 lg:py-2 xl:py-2.5 rounded-lg hover:from-cyan-400 hover:to-blue-500 font-medium text-xs md:text-sm lg:text-base group/link transition-all hover:scale-105 shadow-lg"
              aria-label={`Learn more about ${title}`}
            >
              {linkContent}
            </a>
          )
        ) : (
          isInternalLink ? (
            <Link
              to={link}
              className="inline-flex items-center gap-1.5 md:gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-2.5 md:px-3 lg:px-4 xl:px-5 py-1 md:py-1.5 lg:py-2 xl:py-2.5 rounded-lg hover:from-cyan-400 hover:to-blue-500 font-medium text-xs md:text-sm lg:text-base group/link transition-all hover:scale-105 shadow-lg"
              aria-label={`Learn more about ${title}`}
            >
              {linkContent}
            </Link>
          ) : (
            <a
              href={link}
              className="inline-flex items-center gap-1.5 md:gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-2.5 md:px-3 lg:px-4 xl:px-5 py-1 md:py-1.5 lg:py-2 xl:py-2.5 rounded-lg hover:from-cyan-400 hover:to-blue-500 font-medium text-xs md:text-sm lg:text-base group/link transition-all hover:scale-105 shadow-lg"
              aria-label={`Learn more about ${title}`}
            >
              {linkContent}
            </a>
          )
        )}
      </div>

      {/* Featured badge */}
      {featured && (
        <div className="absolute top-2 right-2 md:top-3 md:right-3 lg:top-4 lg:right-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs font-bold px-1.5 md:px-2 lg:px-3 py-0.5 md:py-1 rounded-full shadow-lg">
          FEATURED
        </div>
      )}

      {/* Early Access badge */}
      {comingSoon && (
        <div className="absolute top-2 right-2 md:top-3 md:right-3 lg:top-4 lg:right-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold px-1.5 md:px-2 lg:px-3 py-0.5 md:py-1 rounded-full shadow-lg">
          Early Access
        </div>
      )}
    </div>
  );
}

export default ProductCard;

