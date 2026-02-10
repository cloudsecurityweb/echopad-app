import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductDownloadCard = ({ activeProduct }) => {
  const navigate = useNavigate();

  if (!activeProduct) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Access Your Product</h3>
        <p className="text-gray-500">Select a product to see download options.</p>
      </div>
    );
  }

  const { name, description, version = '1.0.0' } = activeProduct;

  const handleDownloadClick = () => {
    // Check if it's the AI Scribe product (you might want to check by ID or productCode if available)
    // For now we'll route all downloads for AI Scribe here, or you can check activeProduct.id === 'AI_SCRIBE'
    navigate('/dashboard/product/download/ai-scribe');
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{name}</h3>
        <p className="text-gray-600 mb-6">{description || 'Product description will be available here.'}</p>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Download Button */}
          <div className="flex-1">
            <button
              onClick={handleDownloadClick}
              className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span>Go to Download Page</span>
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center md:text-left pl-1">
              Select your operating system on the next page.
            </p>
          </div>

          {/* Version Info */}
          <div className="flex-shrink-0 md:pl-6 md:border-l md:border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Version Information</h4>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Version:</span> {version}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Last updated:</span> {new Date().toLocaleDateString()}
            </p>
            {/* <a href="#" className="text-sm text-cyan-600 hover:text-cyan-700 font-medium mt-2 inline-block">
              View release notes
            </a> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDownloadCard;
