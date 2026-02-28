import { Link } from 'react-router-dom';

function ProductCard({ icon, title, description, link, featured = false, comingSoon = false, onSelect, image }) {
  const isInternalLink = link && link.startsWith('/') && !link.startsWith('http');
  const useFeaturedImageLayout = featured && image;

  const linkContent = <>Learn More</>;

  const btnClass =
    'inline-flex items-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-cyan-400 hover:to-blue-500 font-medium text-xs md:text-sm group/link transition-all hover:scale-105 shadow-md';

  const handleLearnMoreClick = () => {
    sessionStorage.setItem('homeScrollTo', 'products');
  };

  const cardContent = (
    <>
      {useFeaturedImageLayout ? (
        <>
          <div className="relative w-full aspect-[16/10] rounded-t-xl overflow-hidden bg-gradient-to-br from-cyan-100 to-blue-100">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                const el = e.target;
                el.style.display = 'none';
                const fallback = el.parentElement?.querySelector('[data-product-card-fallback]');
                if (fallback) fallback.classList.remove('hidden');
              }}
            />
            <div
              data-product-card-fallback
              className="hidden absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cyan-100 to-blue-100"
              aria-hidden
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/40">
                <i className={`bi ${icon} text-white text-2xl`}></i>
              </div>
            </div>
          </div>
          <div className="relative z-10 p-4 md:p-5">
            <h4 className="text-base md:text-lg font-bold text-gray-900 mb-2">{title}</h4>
            <p className="text-xs md:text-sm text-gray-600 mb-3 leading-relaxed line-clamp-2">{description}</p>
            {isInternalLink ? (
              <Link to={link} className={btnClass} onClick={(e) => { handleLearnMoreClick(); e.stopPropagation(); }}>
                {linkContent}
              </Link>
            ) : link ? (
              <a href={link} className={btnClass}>
                {linkContent}
              </a>
            ) : onSelect ? (
              <button type="button" className={btnClass} onClick={onSelect}>
                {linkContent}
              </button>
            ) : null}
          </div>
        </>
      ) : (
        <div className="relative z-10">
          <div
            className={`w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center mb-2.5 ${
              featured
                ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/40'
                : comingSoon
                  ? 'bg-gradient-to-br from-gray-200 to-gray-300'
                  : 'bg-gradient-to-br from-gray-100 to-gray-200'
            }`}
          >
            <i
              className={`bi ${icon} ${featured ? 'text-white' : 'text-cyan-600'} text-base md:text-lg`}
            ></i>
          </div>
          <h4 className="text-sm md:text-base font-bold text-gray-900 mb-1.5">{title}</h4>
          <p className="text-xs md:text-sm text-gray-600 mb-2.5 leading-relaxed line-clamp-2">{description}</p>
          {isInternalLink ? (
            <Link to={link} className={btnClass} onClick={handleLearnMoreClick}>
              {linkContent}
            </Link>
          ) : link ? (
            <a href={link} className={btnClass}>
              {linkContent}
            </a>
          ) : onSelect ? (
            <button type="button" className={btnClass} onClick={onSelect}>
              {linkContent}
            </button>
          ) : null}
        </div>
      )}

      {featured && (
        <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow z-20">
          FEATURED
        </div>
      )}

      {comingSoon && (
        <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow z-20">
          Early Access
        </div>
      )}
    </>
  );

  return (
    <div
      className={`glass-card rounded-xl overflow-hidden hover-lift relative shadow-sm cursor-pointer flex flex-col ${
        featured ? 'ring-2 ring-cyan-500/50' : ''
      } ${comingSoon ? 'opacity-90' : ''} ${useFeaturedImageLayout ? 'p-0' : 'p-4 md:p-5'}`}
      onClick={onSelect ? handleCardClick : undefined}
      role={onSelect ? 'button' : undefined}
    >
      {cardContent}
    </div>
  );
}

export default ProductCard;
