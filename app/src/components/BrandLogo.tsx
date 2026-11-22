import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  compact?: boolean;
  inverse?: boolean;
};

export default function BrandLogo({ compact = false, inverse = false }: BrandLogoProps) {
  return (
    <Link
      href="/"
      aria-label="Islomx7 bosh sahifasi"
      className="group inline-flex shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
    >
      <Image
        src="/brand-mark.svg"
        alt=""
        width={42}
        height={42}
        priority
        className="size-9 transition-transform duration-200 group-hover:scale-105 sm:size-10"
      />
      <span className="flex flex-col leading-none">
        <span className={`site-logo font-[family-name:var(--font-manrope)] text-[17px] font-extrabold tracking-[0.07em] sm:text-[19px] ${inverse ? "text-white" : "text-[var(--text)]"}`}>
          ISLOMX7
        </span>
        {!compact && <span className={`mt-1 text-[9px] font-semibold uppercase tracking-[0.19em] ${inverse ? "text-white/65" : "text-[var(--text-muted)]"}`}>Onlayn katalog</span>}
      </span>
    </Link>
  );
}
