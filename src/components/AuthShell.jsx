import Logo from "./Logo";

export default function AuthShell({ title, italic, subtitle, art, children, footer }) {
  return (
    <div className="grid min-h-[calc(100vh-7rem)] lg:grid-cols-2">
      <div className="relative hidden bg-bone lg:block">
        <img src={art} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 text-paper">
          <p className="display text-5xl leading-tight">“Style is a way to say who you are <em className="font-normal">without speaking.</em>”</p>
          <Logo light className="mt-8 inline-block !text-xl" />
        </div>
      </div>
      <div className="flex items-center justify-center px-5 py-14 md:px-10">
        <div className="w-full max-w-md">
          <h1 className="display text-6xl">{title} <em className="font-normal italic">{italic}</em></h1>
          <p className="mt-3 text-ink-soft">{subtitle}</p>
          <div className="mt-9">{children}</div>
          <div className="mt-8 text-center text-sm text-ink-soft">{footer}</div>
        </div>
      </div>
    </div>
  );
}
