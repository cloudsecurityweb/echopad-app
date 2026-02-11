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

  const btnClass = "inline-flex items-center gap-1.5 md:gap-2 bg-blue-600 text-white px-2.5 md:px-3 lg:px-4 xl:px-5 2xl:px-6 3xl:px-8 py-1 md:py-1.5 lg:py-2 xl:py-2.5 2xl:py-3 3xl:py-4 rounded-lg hover:bg-blue-700 font-medium text-xs md:text-sm lg:text-base 2xl:text-lg 3xl:text-xl group/link transition-all hover:scale-105 shadow-lg";

  return (
    <div className={`glass-card rounded-2xl p-2.5 md:p-3 lg:p-4 xl:p-5 2xl:p-6 3xl:p-8 hover-lift relative overflow-hidden shadow-sm ${featured ? 'ring-2 ring-blue-500/35' : ''} ${comingSoon ? 'opacity-90' : ''}`}>
      <div className="relative z-10">
        <div className={`w-9 h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-16 2xl:w-16 2xl:h-16 3xl:w-20 3xl:h-20 rounded-xl flex items-center justify-center mb-1.5 md:mb-2 lg:mb-3 xl:mb-4 2xl:mb-5 3xl:mb-6 ${featured ? 'bg-blue-600 shadow-lg' : comingSoon ? 'bg-gradient-to-br from-gray-200 to-gray-300' : 'bg-gradient-to-br from-gray-100 to-gray-200'}`}>
          <i className={`bi ${icon} ${featured ? 'text-white' : 'text-blue-600'} text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl`}></i>
        </div>
        <h4 className="text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl font-bold text-gray-900 mb-1 md:mb-1.5 lg:mb-2 xl:mb-3 2xl:mb-4">{title}</h4>
        <p className="text-xs md:text-sm lg:text-base 2xl:text-lg 3xl:text-xl text-gray-600 mb-2 md:mb-3 lg:mb-4 xl:mb-5 2xl:mb-6 3xl:mb-8 leading-relaxed">{description}</p>
        {isInternalLink ? (
          <Link to={link} className={btnClass}>
            {linkContent}
          </Link>
        ) : (
          <a href={link} className={btnClass}>
            {linkContent}
          </a>
        )}
      </div>

      {/* Featured badge */}
      {featured && (
        <div className="absolute top-2 right-2 md:top-3 md:right-3 lg:top-4 lg:right-4 2xl:top-5 2xl:right-5 3xl:top-6 3xl:right-6 bg-slate-700 text-white text-xs 2xl:text-sm 3xl:text-base font-bold px-1.5 md:px-2 lg:px-3 2xl:px-4 3xl:px-5 py-0.5 md:py-1 2xl:py-1.5 3xl:py-2 rounded-full shadow-lg">
          FEATURED
        </div>
      )}

      {/* Early Access badge */}
      {comingSoon && (
        <div className="absolute top-2 right-2 md:top-3 md:right-3 lg:top-4 lg:right-4 2xl:top-5 2xl:right-5 3xl:top-6 3xl:right-6 bg-slate-600 text-white text-xs 2xl:text-sm 3xl:text-base font-bold px-1.5 md:px-2 lg:px-3 2xl:px-4 3xl:px-5 py-0.5 md:py-1 2xl:py-1.5 3xl:py-2 rounded-full shadow-lg">
          Early Access
        </div>
      )}
    </div>
  );
}

export default ProductCard;
