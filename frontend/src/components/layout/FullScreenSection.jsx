function FullScreenSection({
  id,
  children,
  className = '',
  as: Tag = 'section',
  centered = true,
  /** When true, section fills viewport height (min-h-screen). Default: false */
  fullHeight = false,
  /** When true, content can scroll inside section if it overflows */
  scrollable = false,
}) {
  const baseClasses = [
    'relative',
    fullHeight ? 'min-h-screen min-h-[100dvh] pt-20 pb-8' : 'py-16 md:py-20',
    'scroll-mt-20',
    centered ? 'flex flex-col items-center justify-center' : 'flex flex-col',
    scrollable ? 'overflow-y-auto' : 'overflow-hidden',
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
