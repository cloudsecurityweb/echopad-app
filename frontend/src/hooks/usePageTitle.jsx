/**
 * Custom hook that provides a JSX title element for setting page titles.
 * Uses React 19's native document metadata support where the <title> tag
 * is automatically hoisted to the document head.
 * 
 * @param {string} title - The page-specific title
 * @param {string} [suffix=' | Echopad AI'] - The suffix to append to the title
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
export default function usePageTitle(title, suffix = ' | Echopad AI') {
    const fullTitle = `${title}${suffix}`;

    // React 19 automatically hoists <title> to the document <head>
    return <title>{fullTitle}</title>;
}
