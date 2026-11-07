import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { addReview, getReviews } from "../services/reviewService";
import { formatDate } from "../lib/format";

export function Stars({ value, size = 16 }) {
  return (
    <span className="inline-flex" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={size} className={n <= Math.round(value) ? "fill-ink stroke-ink" : "stroke-ink/30"} />
      ))}
    </span>
  );
}

// Loads reviews for a product and reports the average up to the parent.
export function useReviews(productId) {
  const [reviews, setReviews] = useState([]);
  const load = useCallback(() => getReviews(productId).then(setReviews).catch(() => setReviews([])), [productId]);
  useEffect(() => { load(); }, [load]);
  const average = reviews.length ? reviews.reduce((n, r) => n + r.rating, 0) / reviews.length : 0;
  return { reviews, average, reload: load };
}

export default function Reviews({ productId, reviews, onChanged }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const mine = user && reviews.some((r) => r.user?.email === user.email);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await addReview(productId, rating, comment.trim());
      toast.success("Thanks for your review!");
      setComment("");
      onChanged();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="container-x pt-16 md:pt-24" aria-labelledby="reviews-title">
      <h2 id="reviews-title" className="display text-4xl md:text-5xl">Customer <em className="font-normal italic">reviews</em></h2>

      <div className="mt-8 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          {reviews.length === 0 ? (
            <p className="text-mute">No reviews yet — be the first to share your thoughts.</p>
          ) : (
            <ul className="divide-y divide-ink/10">
              {reviews.map((r) => (
                <li key={r.id} className="py-5 first:pt-0">
                  <div className="flex items-center justify-between gap-3">
                    <Stars value={r.rating} size={15} />
                    <span className="text-xs text-mute">{formatDate(r.createdAt)}</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold">{r.user?.name || "DripVora customer"}</p>
                  {r.comment && <p className="mt-1 text-sm leading-relaxed text-ink-soft">{r.comment}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="lg:col-span-5">
          {!user ? (
            <p className="bg-bone p-6 text-sm">Want to review this piece? <Link to="/login" state={{ from: `/product/${productId}` }} className="font-semibold link-u">Sign in</Link></p>
          ) : mine ? (
            <p className="bg-bone p-6 text-sm">You've already reviewed this product. Thank you!</p>
          ) : (
            <form onSubmit={submit} className="space-y-4 bg-bone p-6">
              <p className="eyebrow">Write a review</p>
              <div className="flex gap-1" role="radiogroup" aria-label="Rating">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button type="button" key={n} role="radio" aria-checked={rating === n} aria-label={`${n} star${n > 1 ? "s" : ""}`} onClick={() => setRating(n)}>
                    <Star size={26} className={n <= rating ? "fill-ink stroke-ink" : "stroke-ink/30"} />
                  </button>
                ))}
              </div>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} maxLength={1000} placeholder="Tell us about the fit, fabric and feel…"
                className="w-full border border-ink/25 bg-paper p-3 text-sm outline-none focus:border-ink" aria-label="Your review" />
              <button disabled={busy} className="bg-ink px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-clay disabled:bg-mute">{busy ? "Submitting…" : "Submit review"}</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
