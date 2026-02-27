import { Link } from 'react-router-dom';

function ProductCard({ icon, title, description, link, featured = false, comingSoon = false, onSelect }) {
  const isInternalLink = link && link.startsWith('/') && !link.startsWith('http');

  const linkContent = (
    <>
      Learn More
      <i className="bi bi-arrow-right group-hover:translate-x-1 transition-transform text-xs"></i>
    </>
  );

  const btnClass =
    'inline-flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-cyan-400 hover:to-blue-500 font-medium text-xs md:text-sm group/link transition-all hover:scale-105 shadow-md';

  const handleCardClick = (e) => {
    if (onSelect) {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      className={`glass-card rounded-xl p-4 md:p-5 hover-lift relative overflow-hidden shadow-sm cursor-pointer ${
        featured ? 'ring-2 ring-cyan-500/50' : ''
      } ${comingSoon ? 'opacity-90' : ''}`}
      onClick={onSelect ? handleCardClick : undefined}
      role={onSelect ? 'button' : undefined}
    >
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
        <p className="text-xs md:text-sm text-gray-600 mb-2.5 leading-relaxed line-clamp-2">
          {description}
        </p>
        {isInternalLink ? (
          <Link to={link} className={btnClass}>
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

      {featured && (
        <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
          FEATURED
        </div>
      )}

      {comingSoon && (
        <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
          Early Access
        </div>
      )}
    </div>
  );
}

export default ProductCard;
