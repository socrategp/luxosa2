import { useEffect, useState } from 'react';

const CONSENT_STORAGE_KEY = 'luxosa-cookie-consent';

type ConsentChoice = 'accepted' | 'rejected';

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!window.localStorage.getItem(CONSENT_STORAGE_KEY));
  }, []);

  const handleChoice = (choice: ConsentChoice) => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] border-t border-sand/60 bg-ivory/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-10 lg:px-16">
        <div className="max-w-3xl">
          <span className="mb-3 block text-[10px] font-light uppercase tracking-[0.32em] text-brass-muted">
            Trattamento privacy
          </span>
          <p className="text-[14px] font-light leading-[1.8] text-anthracite/75 md:text-[15px]">
            Luxosa utilizza cookie tecnici e strumenti necessari al funzionamento del sito. Puoi accettare o rifiutare il consenso: la scelta verra memorizzata su questo dispositivo.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row md:flex-shrink-0">
          <button
            type="button"
            onClick={() => handleChoice('rejected')}
            className="border border-sand/80 px-7 py-3 text-[11px] font-light uppercase tracking-[0.22em] text-anthracite/65 transition-all duration-500 hover:border-anthracite/35 hover:text-anthracite"
          >
            Rifiuta
          </button>
          <button
            type="button"
            onClick={() => handleChoice('accepted')}
            className="bg-charcoal px-7 py-3 text-[11px] font-light uppercase tracking-[0.22em] text-ivory transition-all duration-500 hover:bg-brass-muted"
          >
            Accetta
          </button>
        </div>
      </div>
    </div>
  );
}
