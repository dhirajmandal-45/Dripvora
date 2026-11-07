import { PackageCheck, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import Reveal from "../Reveal";

const PERKS = [
  { Icon: PackageCheck, title: "Free shipping", text: "On every order above ₹2,999." },
  { Icon: RotateCcw, title: "30-day returns", text: "Changed your mind? No questions." },
  { Icon: ShieldCheck, title: "Secure checkout", text: "UPI, cards and cash on delivery." },
  { Icon: Sparkles, title: "Premium quality", text: "Fabrics chosen to last seasons." },
];

export default function Perks() {
  return (
    <section className="container-x pt-20 md:pt-28">
      <div className="grid grid-cols-2 gap-y-10 border-y border-ink/10 py-12 lg:grid-cols-4">
        {PERKS.map(({ Icon, title, text }, i) => (
          <Reveal key={title} delay={i * 0.07} className="px-2 text-center">
            <Icon size={28} strokeWidth={1.3} className="mx-auto mb-4 text-clay" />
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-mute">{text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
