// "Guarda l'Esperienza" — reusable link-out component for Esperienza
// videos. Deliberately does NOT embed video (neither on web, where it
// would be easy, nor in the PDF, where it's not supported) — it only
// links out, with an optional thumbnail. A QR variant is reserved via
// the `qrPlaceholder` prop but not implemented (no QR dependency has
// been installed — see report notes).
//
// Not yet mounted anywhere — predisposed for when a real video asset
// exists in LUXOSA_TEST_MEDIA_REGISTRY (type: 'video').

interface WatchExperienceLinkProps {
  title: string;
  href: string;
  thumbnailSrc?: string;
  /** Reserved for a future QR code render — intentionally not implemented. */
  qrPlaceholder?: boolean;
}

export default function WatchExperienceLink({ title, href, thumbnailSrc, qrPlaceholder }: WatchExperienceLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 border border-sand/50 bg-ivory/60 px-5 py-4 hover:border-brass/40 transition-colors duration-300"
    >
      {thumbnailSrc && (
        <span className="w-16 h-16 flex-shrink-0 overflow-hidden">
          <img src={thumbnailSrc} alt="" className="w-full h-full object-cover" loading="lazy" />
        </span>
      )}
      <span className="flex-1">
        <span className="block text-[10px] tracking-[0.2em] uppercase text-brass-muted font-light mb-1">
          Guarda l'Esperienza
        </span>
        <span className="block font-serif text-[17px] font-light text-charcoal group-hover:text-brass transition-colors duration-300">
          {title}
        </span>
      </span>
      {qrPlaceholder && (
        <span className="w-10 h-10 flex-shrink-0 border border-dashed border-brass-muted/50 flex items-center justify-center text-[8px] text-brass-muted/70 uppercase tracking-tight">
          QR
        </span>
      )}
    </a>
  );
}
