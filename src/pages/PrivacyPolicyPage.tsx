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

export default function PrivacyPolicyPage() {
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
            Privacy Policy
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
              La presente informativa descrive le modalità di raccolta e trattamento dei dati personali degli utenti che visitano il sito web di Luxosa (di seguito "Sito") o usufruiscono dei servizi offerti dalla Maison, in conformità al Regolamento (UE) 2016/679 (GDPR) e al D.Lgs. 196/2003, come modificato dal D.Lgs. 101/2018.
            </p>
            <p className="mt-5 text-[15px] md:text-[16px] leading-[1.85] text-anthracite/75 font-light">
              Si invita a leggere attentamente il presente documento prima di fornire qualsiasi dato personale o di continuare la navigazione sul Sito.
            </p>
          </div>

          <div className="space-y-2">

            <Section number="01" title="Titolare del Trattamento">
              <p>
                Il Titolare del trattamento dei dati personali è <strong className="font-normal text-anthracite">Luxosa S.r.l.</strong> (o ragione sociale da definire), con sede in Via Cavour 1, 98100 Messina (ME) — Italia.
              </p>
              <p>
                Per qualsiasi comunicazione relativa al trattamento dei dati personali è possibile contattare il Titolare ai seguenti recapiti:
              </p>
              <ul className="list-none space-y-1 text-anthracite/65">
                <li>— E-mail: <span className="text-anthracite/80">[privacy@luxosa.it — da definire]</span></li>
                <li>— Telefono: +39 090 240 3220</li>
                <li>— PEC: <span className="text-anthracite/80">[indirizzo PEC — da definire]</span></li>
              </ul>
            </Section>

            <Section number="02" title="Tipologie di Dati Raccolti">
              <p>Il Titolare raccoglie e tratta le seguenti categorie di dati personali:</p>
              <p><em className="not-italic font-normal text-anthracite/80">Dati forniti volontariamente dall'utente:</em></p>
              <ul className="list-none space-y-1 text-anthracite/65 pl-4">
                <li>— Nome, cognome e dati anagrafici</li>
                <li>— Indirizzo e-mail e numero di telefono</li>
                <li>— Dati relativi allo stato di salute di cute e capelli, forniti nell'ambito della consulenza (dati particolari ex art. 9 GDPR)</li>
                <li>— Messaggi e comunicazioni inviate tramite il modulo di contatto</li>
              </ul>
              <p className="mt-3"><em className="not-italic font-normal text-anthracite/80">Dati raccolti automaticamente durante la navigazione:</em></p>
              <ul className="list-none space-y-1 text-anthracite/65 pl-4">
                <li>— Indirizzo IP e dati di accesso</li>
                <li>— Informazioni sul browser e dispositivo utilizzato</li>
                <li>— Pagine visitate e durata della navigazione</li>
                <li>— Cookie (si rimanda alla Cookie Policy)</li>
              </ul>
            </Section>

            <Section number="03" title="Finalità e Base Giuridica del Trattamento">
              <p>I dati personali vengono trattati per le seguenti finalità:</p>
              <div className="space-y-5">
                <div>
                  <p className="text-anthracite/85 font-normal mb-1">Gestione delle prenotazioni e consulenze</p>
                  <p>Trattamento necessario per l'esecuzione di un contratto o per adempiere a obblighi precontrattuali (art. 6, par. 1, lett. b, GDPR).</p>
                </div>
                <div>
                  <p className="text-anthracite/85 font-normal mb-1">Adempimenti fiscali e contabili</p>
                  <p>Trattamento necessario per adempiere a obblighi di legge (art. 6, par. 1, lett. c, GDPR).</p>
                </div>
                <div>
                  <p className="text-anthracite/85 font-normal mb-1">Comunicazioni di marketing e newsletter</p>
                  <p>Basato sul consenso espresso dell'interessato (art. 6, par. 1, lett. a, GDPR), liberamente revocabile in qualsiasi momento.</p>
                </div>
                <div>
                  <p className="text-anthracite/85 font-normal mb-1">Miglioramento del Sito e analisi statistica</p>
                  <p>Basato sul legittimo interesse del Titolare (art. 6, par. 1, lett. f, GDPR), nel rispetto dei diritti e libertà fondamentali degli utenti.</p>
                </div>
              </div>
            </Section>

            <Section number="04" title="Modalità di Trattamento e Conservazione">
              <p>
                I dati personali sono trattati con strumenti elettronici e/o cartacei, adottando misure tecniche e organizzative adeguate a garantirne la sicurezza, l'integrità e la riservatezza, nel rispetto delle disposizioni di cui agli artt. 25 e 32 del GDPR.
              </p>
              <p>
                I dati saranno conservati per il tempo strettamente necessario al conseguimento delle finalità per cui sono stati raccolti, e comunque:
              </p>
              <ul className="list-none space-y-1 text-anthracite/65 pl-4">
                <li>— Dati contrattuali e fiscali: <strong className="font-normal">10 anni</strong> dalla cessazione del rapporto</li>
                <li>— Dati di contatto e consulenza: <strong className="font-normal">3 anni</strong> dall'ultimo contatto</li>
                <li>— Dati di navigazione: <strong className="font-normal">12 mesi</strong></li>
                <li>— Dati trattati su base di consenso: fino alla revoca del consenso</li>
              </ul>
            </Section>

            <Section number="05" title="Comunicazione e Trasferimento dei Dati">
              <p>
                I dati personali non saranno venduti, ceduti o comunque trasferiti a terzi per finalità proprie di questi ultimi, salvo i casi di seguito indicati o in presenza di un esplicito consenso dell'interessato.
              </p>
              <p>
                I dati potranno essere comunicati a:
              </p>
              <ul className="list-none space-y-1 text-anthracite/65 pl-4">
                <li>— Soggetti che svolgono attività in outsourcing per conto del Titolare (es. fornitori di servizi informatici, piattaforme di prenotazione)</li>
                <li>— Autorità pubbliche e organi di vigilanza, nei casi previsti dalla legge</li>
                <li>— Professionisti e consulenti del Titolare (dottori commercialisti, avvocati) vincolati da obblighi di riservatezza</li>
              </ul>
              <p>
                [Sezione da completare con eventuali trasferimenti extra-UE e relative garanzie]
              </p>
            </Section>

            <Section number="06" title="Diritti dell'Interessato">
              <p>
                In qualità di interessato, l'utente ha il diritto di esercitare in qualsiasi momento i seguenti diritti nei confronti del Titolare, ai sensi degli artt. 15-22 del GDPR:
              </p>
              <ul className="list-none space-y-1.5 text-anthracite/65 pl-4">
                <li>— <strong className="font-normal text-anthracite/80">Accesso</strong>: ottenere conferma del trattamento e copia dei dati personali</li>
                <li>— <strong className="font-normal text-anthracite/80">Rettifica</strong>: correggere dati inesatti o incompleti</li>
                <li>— <strong className="font-normal text-anthracite/80">Cancellazione</strong>: ottenere la cancellazione dei dati ("diritto all'oblio")</li>
                <li>— <strong className="font-normal text-anthracite/80">Limitazione</strong>: richiedere la sospensione del trattamento in determinati casi</li>
                <li>— <strong className="font-normal text-anthracite/80">Portabilità</strong>: ricevere i dati in formato strutturato e leggibile</li>
                <li>— <strong className="font-normal text-anthracite/80">Opposizione</strong>: opporsi al trattamento per motivi legittimi</li>
                <li>— <strong className="font-normal text-anthracite/80">Revoca del consenso</strong>: senza pregiudizio per la liceità del trattamento basato sul consenso prestato prima della revoca</li>
              </ul>
              <p>
                Le richieste possono essere inviate a <span className="text-anthracite/80">[privacy@luxosa.it — da definire]</span>. Il Titolare risponderà entro 30 giorni dalla ricezione. È altresì riconosciuto il diritto di proporre reclamo all'Autorità Garante per la protezione dei dati personali (www.garanteprivacy.it).
              </p>
            </Section>

            <Section number="07" title="Cookie">
              <p>
                Il Sito utilizza cookie e tecnologie di tracciamento analoghe. Per informazioni dettagliate sulle tipologie di cookie utilizzati, sulle finalità e sulle modalità di gestione delle preferenze, si rimanda alla <strong className="font-normal text-anthracite/85">Cookie Policy</strong>.
              </p>
            </Section>

            <Section number="08" title="Sicurezza dei Dati">
              <p>
                Il Titolare adotta misure di sicurezza tecniche e organizzative adeguate per proteggere i dati personali da accessi non autorizzati, divulgazione, alterazione o distruzione. Tuttavia, nessuna trasmissione di dati su Internet o sistema di archiviazione elettronico può essere garantita come sicura al 100%.
              </p>
              <p>
                [Sezione da completare con dettagli tecnici specifici: cifratura, accesso limitato, backup, ecc.]
              </p>
            </Section>

            <Section number="09" title="Minori">
              <p>
                Il Sito e i servizi di Luxosa non sono destinati a soggetti di età inferiore ai 18 anni. Il Titolare non raccoglie consapevolmente dati personali relativi a minori. Qualora vengano identificati trattamenti accidentali di dati di minori, il Titolare provvederà alla loro immediata cancellazione.
              </p>
            </Section>

            <Section number="10" title="Modifiche alla Privacy Policy">
              <p>
                Il Titolare si riserva il diritto di modificare la presente informativa in qualsiasi momento, in conformità con le normative vigenti. Le modifiche verranno pubblicate su questa pagina con indicazione della data di aggiornamento. Si consiglia di consultare periodicamente questa sezione.
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
