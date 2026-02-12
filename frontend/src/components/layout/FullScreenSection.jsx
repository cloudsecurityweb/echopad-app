function FullScreenSection({
  id,
  children,
  className = '',
  as: Tag = 'section',
  centered = true,
  /** When true, content can scroll inside section if it overflows (still min-h-screen) */
  scrollable = false,
}) {
  const baseClasses = [
    'relative',
    'min-h-screen',
    'min-h-[100dvh]',
    'pt-20',
    'pb-8',
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
