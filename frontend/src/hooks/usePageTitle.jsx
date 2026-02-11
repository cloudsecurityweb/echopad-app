/**
 * Custom hook that provides a JSX title element for setting page titles.
 * Uses React 19's native document metadata support where the <title> tag
 * is automatically hoisted to the document head.
 * 
 * @param {string} title - The page-specific title
 * @param {string} [suffix=' | Echopad AI'] - The suffix to append to the title
 * @param {string} [description] - Meta description
 * @param {string} [image] - OG Image URL
 * @returns {JSX.Element} A title element to render in the component
 * 
 * @example
 * function MyPage() {
 *   const PageTitle = usePageTitle('My Page');
 *   return (
 *     <>
 *       {PageTitle}
 *       <div>Page content</div>
 *     </>
 *   );
 * }
 */
export default function usePageTitle(title, suffix = ' | Echopad AI', description = 'Transform your healthcare practice with AI-powered automation. Reduce costs, increase revenue, and improve retention with Echopad AI.', image = '/assets/images/logos/EchopadAIBanner.jpeg') {
    const fullTitle = `${title}${suffix}`;
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const imageUrl = image.startsWith('http') ? image : `${origin}${image}`;

    // React 19 automatically hoists these tags to the document <head>
    return (
        <>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />

            {/* Open Graph / Facebook / LinkedIn / WhatsApp */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={imageUrl} />
            <meta property="og:site_name" content="Echopad AI" />

            {/* Twitter / X */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={imageUrl} />

            {/* Browser / PWA */}
            <meta name="theme-color" content="#ffffff" />
            <meta name="apple-mobile-web-app-title" content="Echopad AI" />
        </>
    );
}
