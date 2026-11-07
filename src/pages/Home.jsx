import { useMemo } from "react";
import { useProducts } from "../context/ProductsContext";
import { inCollection, newArrivals } from "../lib/collections";
import ApiStatus from "../components/ApiStatus";
import Hero from "../components/home/Hero";
import Marquee from "../components/home/Marquee";
import CategoryTiles from "../components/home/CategoryTiles";
import ProductRail from "../components/home/ProductRail";
import CollectionBlock from "../components/home/CollectionBlock";
import PromoBanner from "../components/home/PromoBanner";
import SaleSection from "../components/home/SaleSection";
import Perks from "../components/home/Perks";
import Newsletter from "../components/home/Newsletter";

export default function Home() {
  const { products, loading, error, reload } = useProducts();

  const sections = useMemo(() => {
    const fresh = newArrivals(products);
    const freshIds = new Set(fresh.map((p) => p.id));
    const rest = products.filter((p) => !freshIds.has(p.id));
    return {
      fresh,
      featured: (rest.length >= 4 ? rest : products).slice(0, 8),
      men: products.filter((p) => inCollection(p, "men")).slice(0, 4),
      women: products.filter((p) => inCollection(p, "women")).slice(0, 4),
      sale: products.filter((p) => p.discount > 0).sort((a, b) => b.discount - a.discount).slice(0, 4),
    };
  }, [products]);

  return (
    <>
      <Hero />
      <Marquee />
      <ApiStatus error={error} onRetry={reload} />
      {!loading && !error && products.length === 0 && (
        <p className="container-x pt-10 text-center text-mute">New pieces are on their way — check back very soon.</p>
      )}
      <CategoryTiles />
      <ProductRail eyebrow="Just landed" title="New" italic="arrivals" to="/shop/new-arrivals" products={sections.fresh} />
      <ProductRail eyebrow="Staff picks" title="Featured" italic="pieces" to="/shop/all" products={sections.featured} />
      <CollectionBlock
        eyebrow="Men" title="The men's" italic="collection" to="/shop/men" art="/art/product-shirt.svg"
        copy="Heavyweight tees, utility trousers and layers that work from morning to midnight."
        products={sections.men}
      />
      <CollectionBlock
        flip eyebrow="Women" title="The women's" italic="collection" to="/shop/women" art="/art/product-knit.svg"
        copy="Soft knits, fluid dresses and sharp tailoring — pieces you'll reach for again and again."
        products={sections.women}
      />
      <PromoBanner />
      <SaleSection products={sections.sale} />
      <Perks />
      <Newsletter />
    </>
  );
}
