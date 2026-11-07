import { useState } from "react";
import toast from "react-hot-toast";
import { ArrowRight } from "lucide-react";
import Reveal from "../Reveal";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error("Please enter a valid email.");
    toast.success("You're on the list. Welcome to DripVora!");
    setEmail("");
  };

  return (
    <section className="container-x pt-20 md:pt-28">
      <Reveal className="bg-bone px-6 py-16 text-center md:py-24">
        <p className="eyebrow mb-4 text-clay">Join the list</p>
        <h2 className="display mx-auto max-w-2xl text-5xl md:text-7xl">Get <em className="font-normal italic">10% off</em> your first order</h2>
        <p className="mx-auto mt-4 max-w-md text-ink-soft">Early access to drops, styling notes and members-only offers. No spam — ever.</p>
        <form onSubmit={submit} className="mx-auto mt-9 flex max-w-lg flex-col gap-3 sm:flex-row">
          <label htmlFor="nl-email" className="sr-only">Email address</label>
          <input id="nl-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address"
            className="flex-1 border border-ink/25 bg-paper px-5 py-4 text-sm outline-none transition focus:border-ink" />
          <button className="group inline-flex items-center justify-center gap-2 bg-ink px-8 py-4 text-sm font-semibold text-paper transition-colors hover:bg-clay">
            Subscribe <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </form>
      </Reveal>
    </section>
  );
}
