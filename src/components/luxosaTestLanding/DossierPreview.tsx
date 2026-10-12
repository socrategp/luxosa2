import type { ReactNode } from 'react';
import { LandingLogo } from './LandingChrome';

/**
 * Illustrative, non-personal preview of the Dossier Luxosa. Section labels
 * mirror the real result blocks; content is skeleton or blurred on purpose,
 * so the mockup never shows a fake outcome.
 */

function Bar({ width }: { width: string }) {
  return <span className={`block h-[6px] rounded-full bg-sand/70 ${width}`} />;
}

function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="py-4 border-t border-sand/50">
      <p className="text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-brass-muted font-light mb-3">{label}</p>
      {children}
    </div>
  );
}

export default function DossierPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[400px]" aria-hidden="true">
      <div className="absolute inset-0 translate-x-3 translate-y-3 md:translate-x-5 md:translate-y-5 rotate-[2.5deg] bg-ecru border border-sand/60" />
      <div className="relative bg-ivory border border-sand/70 shadow-[0_30px_60px_-30px_rgba(40,37,32,0.22)] px-7 py-7 md:px-9 md:py-8 -rotate-[1deg]">
        <div className="flex items-center justify-between">
          <LandingLogo onDark={false} className="h-4 md:h-[18px] opacity-80" />
          <span className="text-[9px] tracking-[0.3em] uppercase text-stone font-light">Dossier personale</span>
        </div>
        <div className="h-[1px] bg-brass/50 mt-5 mb-5" />

        <p className="text-[10px] tracking-[0.2em] uppercase text-stone font-light">Preparato per</p>
        <p className="font-serif italic text-[22px] text-charcoal/80 font-light mt-1 mb-4">Il suo nome</p>

        <Block label="Profilo di partenza">
          <div className="space-y-2.5">
            <Bar width="w-full" />
            <Bar width="w-4/5" />
          </div>
        </Block>

        <Block label="Segnali rilevati">
          <div className="flex flex-wrap gap-2">
            {['w-16', 'w-20', 'w-14'].map((w) => (
              <span key={w} className="inline-flex items-center px-3 py-2 border border-sand/70 bg-ecru/50">
                <span className={`block h-[5px] rounded-full bg-tortora/80 ${w}`} />
              </span>
            ))}
          </div>
        </Block>

        <Block label="Percorso emerso">
          <p className="font-serif text-[26px] md:text-[28px] font-light text-charcoal leading-none blur-[6px] select-none">Percorso Luxosa</p>
          <p className="mt-3 text-[11px] italic text-brass-muted font-light">Si rivela al termine del Test</p>
        </Block>

        <Block label="Esperienze Signature suggerite">
          <div className="space-y-3">
            {['w-3/5', 'w-1/2'].map((w) => (
              <div key={w} className="flex items-center gap-4">
                <span className="text-[10px] tracking-[0.15em] text-brass-muted font-light blur-[3px] select-none">EX·00</span>
                <Bar width={w} />
              </div>
            ))}
          </div>
        </Block>

        <Block label="Da approfondire in consulenza">
          <Bar width="w-2/3" />
        </Block>

        <p className="mt-2 pt-5 border-t border-sand/50 text-[9px] tracking-[0.25em] uppercase text-stone font-light">
          Orientamento preliminare
        </p>
      </div>
    </div>
  );
}
