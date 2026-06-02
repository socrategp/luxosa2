import { t } from '../i18n/t';
﻿import { motion } from 'framer-motion';

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
      <div className="pl-10 md:pl-16 space-y-4 text-[17px] md:text-[18px] leading-[1.85] text-anthracite/85 font-light">
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
      <table className="w-full text-[16px] font-light">
        <thead>
          <tr className="border-b border-sand">
            <th className="text-left py-2.5 pr-4 text-[10px] tracking-[0.25em] uppercase text-anthracite/65 font-light">{t('common:cookie.policy.page.001')}</th>
            <th className="text-left py-2.5 pr-4 text-[10px] tracking-[0.25em] uppercase text-anthracite/65 font-light">{t('common:cookie.policy.page.002')}</th>
            <th className="text-left py-2.5 pr-4 text-[10px] tracking-[0.25em] uppercase text-anthracite/65 font-light">{t('common:cookie.policy.page.003')}</th>
            <th className="text-left py-2.5 text-[10px] tracking-[0.25em] uppercase text-anthracite/65 font-light">{t('common:cookie.policy.page.004')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-sand/40">
              <td className="py-3 pr-4 text-anthracite/90 font-normal">{row.nome}</td>
              <td className="py-3 pr-4 text-anthracite/75">{row.tipo}</td>
              <td className="py-3 pr-4 text-anthracite/75 whitespace-nowrap">{row.durata}</td>
              <td className="py-3 text-anthracite/75">{row.finalita}</td>
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
      <section className="bg-ivory-warm pt-40 pb-20 md:pt-48 md:pb-24">
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
          >{t('common:cookie.policy.page.005')}</motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease, delay: 0.25 }}
            className="font-serif text-[36px] md:text-[48px] lg:text-[56px] font-light leading-[1.08] text-charcoal tracking-[0.01em]"
          >{t('common:cookie.policy.page.006')}</motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease, delay: 0.45 }}
            className="mt-6 text-[16px] text-stone font-light tracking-wide"
          >{t('common:cookie.policy.page.007')}</motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 md:py-28 bg-ivory">
        <div className="max-w-[800px] mx-auto px-6 md:px-10 lg:px-16">

          {/* Intro */}
          <div className="mb-14 pb-10 border-b border-sand/60">
            <p className="text-[18px] md:text-[20px] leading-[1.85] text-anthracite/90 font-light">{t('common:cookie.policy.page.008')}</p>
            <p className="mt-5 text-[18px] md:text-[20px] leading-[1.85] text-anthracite/90 font-light">{t('common:cookie.policy.page.009')}<strong className="font-normal text-anthracite/95">{t('common:cookie.policy.page.010')}</strong>.
            </p>
          </div>

          <div className="space-y-2">

            <Section number="01" title={t('common:cookie.policy.page.011')}>
              <p>{t('common:cookie.policy.page.012')}</p>
              <p>{t('common:cookie.policy.page.013')}</p>
            </Section>

            <Section number="02" title={t('common:cookie.policy.page.014')}>
              <p>{t('common:cookie.policy.page.015')}</p>

              <div className="space-y-6 mt-2">
                <div>
                  <p className="text-anthracite/95 font-normal mb-2">{t('common:cookie.policy.page.016')}</p>
                  <p>{t('common:cookie.policy.page.017')}</p>
                  <CookieTable rows={[
                    { nome:t('common:cookie.policy.page.018'), tipo: 'Session', durata: 'Sessione', finalita: 'Gestione della sessione utente' },
                    { nome:t('common:cookie.policy.page.019'), tipo: 'Persistente', durata: '12 mesi', finalita: 'Memorizzazione preferenze cookie' },
                    { nome:t('common:cookie.policy.page.020'), tipo: '—', durata: '—', finalita: 'Da definire con il team tecnico' },
                  ]} />
                </div>

                <div>
                  <p className="text-anthracite/95 font-normal mb-2">{t('common:cookie.policy.page.021')}</p>
                  <p>{t('common:cookie.policy.page.022')}</p>
                  <CookieTable rows={[
                    { nome:t('common:cookie.policy.page.023'), tipo: 'Persistente', durata: '2 anni', finalita: 'Google Analytics — identificazione utente univoco' },
                    { nome:t('common:cookie.policy.page.024'), tipo: 'Persistente', durata: '2 anni', finalita: 'Google Analytics — mantenimento stato sessione' },
                    { nome:t('common:cookie.policy.page.025'), tipo: 'Persistente', durata: '24 ore', finalita: 'Google Analytics — distinzione utenti' },
                    { nome:t('common:cookie.policy.page.026'), tipo: '—', durata: '—', finalita: 'Da definire con il team tecnico' },
                  ]} />
                </div>

                <div>
                  <p className="text-anthracite/95 font-normal mb-2">{t('common:cookie.policy.page.027')}</p>
                  <p>{t('common:cookie.policy.page.028')}</p>
                  <CookieTable rows={[
                    { nome:t('common:cookie.policy.page.029'), tipo: '—', durata: '—', finalita: 'Da definire — es. Meta Pixel, Google Ads' },
                  ]} />
                  <p className="mt-3 text-[16px] text-anthracite/65">{t('common:cookie.policy.page.030')}</p>
                </div>
              </div>
            </Section>

            <Section number="03" title={t('common:cookie.policy.page.031')}>
              <p>{t('common:cookie.policy.page.032')}</p>
              <ul className="list-none space-y-2 text-anthracite/80 pl-4">
                <li>
                  — <strong className="font-normal text-anthracite/95">{t('common:cookie.policy.page.033')}</strong>{t('common:cookie.policy.page.034')}<br /><span className="text-[16px]">{t('common:cookie.policy.page.035')}</span>
                </li>
                <li>
                  — <strong className="font-normal text-anthracite/95">{t('common:cookie.policy.page.036')}</strong>{t('common:cookie.policy.page.037')}<br /><span className="text-[16px]">{t('common:cookie.policy.page.038')}</span>
                </li>
                <li>
                  — <strong className="font-normal text-anthracite/95">{t('common:cookie.policy.page.039')}</strong>
                  <br /><span className="text-[16px]">{t('common:cookie.policy.page.040')}</span>
                </li>
                <li>
                  — <strong className="font-normal text-anthracite/95">{t('common:cookie.policy.page.041')}</strong>
                </li>
              </ul>
            </Section>

            <Section number="04" title={t('common:cookie.policy.page.042')}>
              <p>{t('common:cookie.policy.page.043')}</p>
              <p>{t('common:cookie.policy.page.044')}</p>
              <p>{t('common:cookie.policy.page.045')}<strong className="font-normal">{t('common:cookie.policy.page.046')}</strong>{t('common:cookie.policy.page.047')}</p>
            </Section>

            <Section number="05" title={t('common:cookie.policy.page.048')}>
              <p>{t('common:cookie.policy.page.049')}</p>
              <ul className="list-none space-y-1.5 text-anthracite/80 pl-4">
                <li>— <strong className="font-normal text-anthracite/95">{t('common:cookie.policy.page.050')}</strong>{t('common:cookie.policy.page.051')}</li>
                <li>— <strong className="font-normal text-anthracite/95">{t('common:cookie.policy.page.052')}</strong>{t('common:cookie.policy.page.053')}</li>
                <li>— <strong className="font-normal text-anthracite/95">{t('common:cookie.policy.page.054')}</strong>{t('common:cookie.policy.page.055')}</li>
                <li>— <strong className="font-normal text-anthracite/95">{t('common:cookie.policy.page.056')}</strong>{t('common:cookie.policy.page.057')}</li>
              </ul>
              <p className="mt-2 text-[16px] text-anthracite/65">{t('common:cookie.policy.page.058')}</p>
            </Section>

            <Section number="06" title={t('common:cookie.policy.page.059')}>
              <p>{t('common:cookie.policy.page.060')}<br /><span className="text-anthracite/95">{t('common:cookie.policy.page.061')}</span>
              </p>
            </Section>

            <Section number="07" title={t('common:cookie.policy.page.062')}>
              <p>{t('common:cookie.policy.page.063')}</p>
              <p>{t('common:cookie.policy.page.064')}</p>
            </Section>

          </div>

          {/* Bottom note */}
          <div className="mt-16 pt-10 border-t border-sand/60">
            <p className="text-[12px] tracking-[0.15em] text-stone/60 font-light text-center">{t('common:cookie.policy.page.065')}<span className="text-anthracite/55">{t('common:cookie.policy.page.066')}</span>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
