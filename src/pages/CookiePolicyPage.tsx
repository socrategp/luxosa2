import { motion } from 'framer-motion';

const ease = [0.25, 0.1, 0, 1] as const;

interface SectionProps {
  number: string;
  title: string;
  children: React.ReactNode;
}

function Section({ number, title, children }: SectionProps) {
  return (
    <div className="border-t border-sand/60 pt-10 pb-4">
      <div className="flex gap-6 md:gap-10 items-baseline mb-5">
        <span className="font-serif text-[20px] text-brass/50 font-light flex-shrink-0">{number}</span>
        <h2 className="font-serif text-[22px] md:text-[26px] font-light text-charcoal tracking-wide leading-snug">
          {title}
        </h2>
      </div>
      <div className="pl-10 md:pl-16 space-y-4 text-[14px] md:text-[15px] leading-[1.85] text-anthracite/70 font-light">
        {children}
      </div>
    </div>
  );
}

interface CookieTableProps {
  rows: { nome: string; tipo: string; durata: string; finalita: string }[];
}

function CookieTable({ rows }: CookieTableProps) {
  return (
    <div className="overflow-x-auto mt-4">
      <table className="w-full text-[13px] font-light">
        <thead>
          <tr className="border-b border-sand">
            <th className="text-left py-2.5 pr-4 text-[10px] tracking-[0.25em] uppercase text-anthracite/50 font-light">Nome</th>
            <th className="text-left py-2.5 pr-4 text-[10px] tracking-[0.25em] uppercase text-anthracite/50 font-light">Tipo</th>
            <th className="text-left py-2.5 pr-4 text-[10px] tracking-[0.25em] uppercase text-anthracite/50 font-light">Durata</th>
            <th className="text-left py-2.5 text-[10px] tracking-[0.25em] uppercase text-anthracite/50 font-light">Finalità</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-sand/40">
              <td className="py-3 pr-4 text-anthracite/75 font-normal">{row.nome}</td>
              <td className="py-3 pr-4 text-anthracite/60">{row.tipo}</td>
              <td className="py-3 pr-4 text-anthracite/60 whitespace-nowrap">{row.durata}</td>
              <td className="py-3 text-anthracite/60">{row.finalita}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CookiePolicyPage() {
  return (
    <>
      {/* Page header */}
      <section className="bg-ecru/40 pt-40 pb-20 md:pt-48 md:pb-24">
        <div className="max-w-[800px] mx-auto px-6 md:px-10 lg:px-16">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 40 }}
            transition={{ duration: 1, ease }}
            className="h-[1px] bg-brass mb-8"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.15 }}
            className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light mb-5"
          >
            Documenti legali
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease, delay: 0.25 }}
            className="font-serif text-[36px] md:text-[48px] lg:text-[56px] font-light leading-[1.08] text-charcoal tracking-[0.01em]"
          >
            Cookie Policy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease, delay: 0.45 }}
            className="mt-6 text-[13px] text-stone font-light tracking-wide"
          >
            Ultimo aggiornamento: [data da definire] — Versione 1.0
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 md:py-28 bg-ivory">
        <div className="max-w-[800px] mx-auto px-6 md:px-10 lg:px-16">

          {/* Intro */}
          <div className="mb-14 pb-10 border-b border-sand/60">
            <p className="text-[15px] md:text-[16px] leading-[1.85] text-anthracite/75 font-light">
              La presente Cookie Policy descrive le tipologie di cookie e tecnologie di tracciamento utilizzate dal sito web di Luxosa (di seguito "Sito"), con sede in Via Cavour 1, Messina, in conformità alla Direttiva 2009/136/CE (c.d. Cookie Law), al Regolamento (UE) 2016/679 (GDPR) e alle Linee Guida del Garante per la protezione dei dati personali.
            </p>
            <p className="mt-5 text-[15px] md:text-[16px] leading-[1.85] text-anthracite/75 font-light">
              Per informazioni più generali sul trattamento dei dati personali, si rimanda alla <strong className="font-normal text-anthracite/85">Privacy Policy</strong>.
            </p>
          </div>

          <div className="space-y-2">

            <Section number="01" title="Cosa sono i Cookie">
              <p>
                I cookie sono piccoli file di testo che i siti web visitati dall'utente inviano al suo dispositivo (computer, tablet, smartphone), dove vengono memorizzati e successivamente ritrasmessi agli stessi siti al momento della visita successiva.
              </p>
              <p>
                I cookie consentono al Sito di riconoscere il dispositivo dell'utente, memorizzare le sue preferenze e raccogliere informazioni sulla navigazione, al fine di migliorare l'esperienza d'uso e la fruizione dei servizi offerti.
              </p>
            </Section>

            <Section number="02" title="Tipologie di Cookie Utilizzati">
              <p>Il Sito utilizza le seguenti categorie di cookie:</p>

              <div className="space-y-6 mt-2">
                <div>
                  <p className="text-anthracite/85 font-normal mb-2">Cookie tecnici (strettamente necessari)</p>
                  <p>
                    Sono indispensabili per il corretto funzionamento del Sito. Senza questi cookie alcune funzionalità non sarebbero disponibili. Non richiedono il consenso dell'utente ai sensi dell'art. 122 del Codice Privacy.
                  </p>
                  <CookieTable rows={[
                    { nome: 'session_id', tipo: 'Session', durata: 'Sessione', finalita: 'Gestione della sessione utente' },
                    { nome: 'cookie_consent', tipo: 'Persistente', durata: '12 mesi', finalita: 'Memorizzazione preferenze cookie' },
                    { nome: '[da completare]', tipo: '—', durata: '—', finalita: 'Da definire con il team tecnico' },
                  ]} />
                </div>

                <div>
                  <p className="text-anthracite/85 font-normal mb-2">Cookie analitici</p>
                  <p>
                    Raccolgono informazioni aggregate e anonime sulle modalità di utilizzo del Sito (pagine visitate, tempo di permanenza, provenienza del traffico) al fine di migliorarne le prestazioni. Richiedono il consenso dell'utente.
                  </p>
                  <CookieTable rows={[
                    { nome: '_ga', tipo: 'Persistente', durata: '2 anni', finalita: 'Google Analytics — identificazione utente univoco' },
                    { nome: '_ga_*', tipo: 'Persistente', durata: '2 anni', finalita: 'Google Analytics — mantenimento stato sessione' },
                    { nome: '_gid', tipo: 'Persistente', durata: '24 ore', finalita: 'Google Analytics — distinzione utenti' },
                    { nome: '[da completare]', tipo: '—', durata: '—', finalita: 'Da definire con il team tecnico' },
                  ]} />
                </div>

                <div>
                  <p className="text-anthracite/85 font-normal mb-2">Cookie di marketing e profilazione</p>
                  <p>
                    Utilizzati per tracciare i visitatori tra i siti web e visualizzare annunci pertinenti. Richiedono il consenso esplicito dell'utente.
                  </p>
                  <CookieTable rows={[
                    { nome: '[da completare]', tipo: '—', durata: '—', finalita: 'Da definire — es. Meta Pixel, Google Ads' },
                  ]} />
                  <p className="mt-3 text-[13px] text-anthracite/50">
                    [Sezione da completare in base agli strumenti di marketing effettivamente utilizzati]
                  </p>
                </div>
              </div>
            </Section>

            <Section number="03" title="Cookie di Terze Parti">
              <p>
                Il Sito può incorporare contenuti o servizi forniti da terze parti che installano i propri cookie sul dispositivo dell'utente. Il Titolare non ha controllo diretto su tali cookie e si rimanda alle rispettive informative:
              </p>
              <ul className="list-none space-y-2 text-anthracite/65 pl-4">
                <li>
                  — <strong className="font-normal text-anthracite/80">Google Analytics</strong> (Google LLC) — Analisi statistica del traffico
                  <br /><span className="text-[13px]">Privacy Policy: policies.google.com/privacy</span>
                </li>
                <li>
                  — <strong className="font-normal text-anthracite/80">Google Maps</strong> (Google LLC) — Visualizzazione mappe nelle pagine Sedi
                  <br /><span className="text-[13px]">Privacy Policy: policies.google.com/privacy</span>
                </li>
                <li>
                  — <strong className="font-normal text-anthracite/80">[Piattaforma di prenotazione — da definire]</strong>
                  <br /><span className="text-[13px]">Privacy Policy: [da completare]</span>
                </li>
                <li>
                  — <strong className="font-normal text-anthracite/80">[Eventuali altri servizi — da definire]</strong>
                </li>
              </ul>
            </Section>

            <Section number="04" title="Gestione del Consenso">
              <p>
                Al primo accesso al Sito, all'utente viene presentato un banner informativo che consente di accettare, rifiutare o personalizzare le proprie preferenze in materia di cookie non tecnici.
              </p>
              <p>
                Il consenso prestato può essere revocato in qualsiasi momento accedendo al pannello di gestione delle preferenze, disponibile [modalità di accesso da definire — es. link in footer, icona flottante].
              </p>
              <p>
                Il consenso sarà memorizzato per un periodo di <strong className="font-normal">12 mesi</strong>, trascorsi i quali verrà nuovamente richiesto.
              </p>
            </Section>

            <Section number="05" title="Come Disabilitare i Cookie dal Browser">
              <p>
                Indipendentemente dalla gestione tramite il banner del Sito, l'utente può configurare il proprio browser per accettare o rifiutare tutti i cookie, oppure per ricevere una notifica ogni volta che un cookie viene inviato. Di seguito i link alle istruzioni dei principali browser:
              </p>
              <ul className="list-none space-y-1.5 text-anthracite/65 pl-4">
                <li>— <strong className="font-normal text-anthracite/80">Google Chrome</strong>: support.google.com/chrome/answer/95647</li>
                <li>— <strong className="font-normal text-anthracite/80">Mozilla Firefox</strong>: support.mozilla.org/kb/enable-and-disable-cookies</li>
                <li>— <strong className="font-normal text-anthracite/80">Safari</strong>: support.apple.com/guide/safari/manage-cookies</li>
                <li>— <strong className="font-normal text-anthracite/80">Microsoft Edge</strong>: support.microsoft.com/microsoft-edge/delete-cookies</li>
              </ul>
              <p className="mt-2 text-[13px] text-anthracite/50">
                Nota: la disabilitazione totale dei cookie potrebbe compromettere la corretta fruizione di alcune funzionalità del Sito.
              </p>
            </Section>

            <Section number="06" title="Opt-out dagli Strumenti Analitici">
              <p>
                Per disattivare specificamente il tracciamento di Google Analytics su tutti i siti web, è possibile installare il componente aggiuntivo del browser disponibile all'indirizzo:
                <br /><span className="text-anthracite/80">tools.google.com/dlpage/gaoptout</span>
              </p>
            </Section>

            <Section number="07" title="Modifiche alla Cookie Policy">
              <p>
                Il Titolare si riserva il diritto di modificare la presente Cookie Policy in qualsiasi momento, in particolare a seguito di variazioni normative o all'adozione di nuovi strumenti tecnologici. Le modifiche verranno pubblicate su questa pagina con indicazione della data di aggiornamento.
              </p>
              <p>
                La versione attuale è la 1.0, in vigore dal [data da definire].
              </p>
            </Section>

          </div>

          {/* Bottom note */}
          <div className="mt-16 pt-10 border-t border-sand/60">
            <p className="text-[12px] tracking-[0.15em] text-stone/60 font-light text-center">
              Luxosa — Via Cavour 1, Messina — <span className="text-anthracite/40">[privacy@luxosa.it — da definire]</span>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
