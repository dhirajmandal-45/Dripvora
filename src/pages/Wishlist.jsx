import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";

export default function Wishlist() {
  const { user } = useAuth();
  const { products } = useWishlist();

  return (
    <div className="container-x py-10 md:py-16">
      <h1 className="display text-6xl md:text-7xl">Your <em className="font-normal italic">wishlist</em></h1>
      {products.length === 0 ? (
        <div className="py-24 text-center">
          <Heart size={48} strokeWidth={1.1} className="mx-auto text-mute" />
          <p className="display mt-5 text-4xl">Nothing saved yet</p>
          <p className="mt-2 text-mute">{user ? "Tap the heart on any piece to save it for later." : "Sign in to save pieces you love."}</p>
          <Link to={user ? "/shop/all" : "/login"} state={user ? undefined : { from: "/wishlist" }} className="mt-7 inline-block bg-ink px-8 py-4 text-sm font-semibold text-paper hover:bg-clay transition-colors">
            {user ? "Browse the collection" : "Sign in"}
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
