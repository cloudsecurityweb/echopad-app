import { useMemo } from 'react';
import ProductCard from './ProductCard';

function ProductGrid({ products, subscribedSkus }) {
  // Sort products: subscribed first, then available
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const skuA = a.sku || a.productCode || a.id;
      const skuB = b.sku || b.productCode || b.id;
      const aIsSubscribed = subscribedSkus.includes(skuA);
      const bIsSubscribed = subscribedSkus.includes(skuB);
      
      // Subscribed products come first
      if (aIsSubscribed && !bIsSubscribed) return -1;
      if (!aIsSubscribed && bIsSubscribed) return 1;
      
      // If both have same subscription status, maintain original order
      return 0;
    });
  }, [products, subscribedSkus]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {sortedProducts.map((product) => {
        const sku = product.sku || product.productCode || product.id;
        return (
          <ProductCard
            key={sku}
            product={product}
            isSubscribed={subscribedSkus.includes(sku)}
          />
        );
      })}
      {products.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-gray-600">
          No products available at the moment.
        </div>
      )}
    </div>
  );
}

export default ProductGrid;
