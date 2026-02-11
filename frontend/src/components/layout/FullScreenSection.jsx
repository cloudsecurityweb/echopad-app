function FullScreenSection({
  id,
  children,
  className = '',
  as: Tag = 'section',
  centered = true,
}) {
  const baseClasses = [
    'relative',
    'min-h-screen',
    'pt-16',
    'scroll-mt-16',
    centered ? 'flex flex-col items-center justify-center' : '',
    'overflow-hidden',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag id={id} className={`${baseClasses} ${className}`}>
      {children}
    </Tag>
  );
}

export default FullScreenSection;
