import Section from "../components/Section";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../../../../hooks/useProducts";

function ProductsSection() {
  const { products, updateProduct } = useProducts();

  return (
    <Section title="Products">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard
            key={product.productCode}
            product={product}
            onManage={() =>
              console.log("Manage product:", product.productCode)
            }
            onAnalytics={() =>
              console.log("View analytics for:", product.productCode)
            }
          />
        ))}
      </div>
    </Section>
  );
}

export default ProductsSection;
