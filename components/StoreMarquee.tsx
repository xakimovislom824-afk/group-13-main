import { ArrowRight, Sparkles } from "lucide-react";

const messages = [
  "ISLOMX7 — Siz izlagan mahsulotlar bir joyda",
  "Eng yaxshi takliflarni kashf eting",
  "Yangi mahsulotlar katalogda",
  "Qulay va oson mahsulot qidirish",
  "ISLOMX7 bilan xarid qilish osonroq",
];

function MessageTrack({ copy = false }: { copy?: boolean }) {
  return (
    <div className="flex shrink-0 items-center gap-8 px-4" aria-hidden={copy || undefined}>
      {messages.map((message) => (
        <span key={message} className="inline-flex shrink-0 items-center gap-4 whitespace-nowrap text-sm font-medium text-white/90 sm:text-base">
          <Sparkles aria-hidden="true" className="size-4 shrink-0 text-[var(--accent)]" />
          {message}
          <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-[var(--accent)]/80" />
        </span>
      ))}
    </div>
  );
}

export default function StoreMarquee() {
  return (
    <section aria-label="ISLOMX7 yangiliklari va takliflari" className="my-6 overflow-hidden rounded-xl border border-white/10 bg-[#0B2545] py-4 shadow-sm sm:my-8 sm:py-5">
      <div className="store-marquee-track flex w-max motion-reduce:transform-none">
        <MessageTrack />
        <MessageTrack copy />
      </div>
    </section>
  );
}
