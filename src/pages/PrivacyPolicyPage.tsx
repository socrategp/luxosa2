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

export default function PrivacyPolicyPage() {
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
          >{t('common:privacy.policy.page.001')}</motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease, delay: 0.25 }}
            className="font-serif text-[36px] md:text-[48px] lg:text-[56px] font-light leading-[1.08] text-charcoal tracking-[0.01em]"
          >{t('common:privacy.policy.page.002')}</motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease, delay: 0.45 }}
            className="mt-6 text-[16px] text-stone font-light tracking-wide"
          >{t('common:privacy.policy.page.003')}</motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 md:py-28 bg-ivory">
        <div className="max-w-[800px] mx-auto px-6 md:px-10 lg:px-16">

          {/* Intro */}
          <div className="mb-14 pb-10 border-b border-sand/60">
            <p className="text-[18px] md:text-[20px] leading-[1.85] text-anthracite/90 font-light">{t('common:privacy.policy.page.004')}</p>
            <p className="mt-5 text-[18px] md:text-[20px] leading-[1.85] text-anthracite/90 font-light">{t('common:privacy.policy.page.005')}</p>
          </div>

          <div className="space-y-2">

            <Section number="01" title={t('common:privacy.policy.page.006')}>
              <p>{t('common:privacy.policy.page.007')}<strong className="font-normal text-anthracite">{t('common:privacy.policy.page.008')}</strong>{t('common:privacy.policy.page.009')}</p>
              <p>{t('common:privacy.policy.page.010')}</p>
              <ul className="list-none space-y-1 text-anthracite/80">
                <li>{t('common:privacy.policy.page.011')}<span className="text-anthracite/95">{t('common:privacy.policy.page.012')}</span></li>
                <li>{t('common:privacy.policy.page.013')}</li>
                <li>{t('common:privacy.policy.page.014')}<span className="text-anthracite/95">{t('common:privacy.policy.page.015')}</span></li>
              </ul>
            </Section>

            <Section number="02" title={t('common:privacy.policy.page.016')}>
              <p>{t('common:privacy.policy.page.017')}</p>
              <p><em className="not-italic font-normal text-anthracite/95">{t('common:privacy.policy.page.018')}</em></p>
              <ul className="list-none space-y-1 text-anthracite/80 pl-4">
                <li>{t('common:privacy.policy.page.019')}</li>
                <li>{t('common:privacy.policy.page.020')}</li>
                <li>{t('common:privacy.policy.page.021')}</li>
                <li>{t('common:privacy.policy.page.022')}</li>
              </ul>
              <p className="mt-3"><em className="not-italic font-normal text-anthracite/95">{t('common:privacy.policy.page.023')}</em></p>
              <ul className="list-none space-y-1 text-anthracite/80 pl-4">
                <li>{t('common:privacy.policy.page.024')}</li>
                <li>{t('common:privacy.policy.page.025')}</li>
                <li>{t('common:privacy.policy.page.026')}</li>
                <li>{t('common:privacy.policy.page.027')}</li>
              </ul>
            </Section>

            <Section number="03" title={t('common:privacy.policy.page.028')}>
              <p>{t('common:privacy.policy.page.029')}</p>
              <div className="space-y-5">
                <div>
                  <p className="text-anthracite/95 font-normal mb-1">{t('common:privacy.policy.page.030')}</p>
                  <p>{t('common:privacy.policy.page.031')}</p>
                </div>
                <div>
                  <p className="text-anthracite/95 font-normal mb-1">{t('common:privacy.policy.page.032')}</p>
                  <p>{t('common:privacy.policy.page.033')}</p>
                </div>
                <div>
                  <p className="text-anthracite/95 font-normal mb-1">{t('common:privacy.policy.page.034')}</p>
                  <p>{t('common:privacy.policy.page.035')}</p>
                </div>
                <div>
                  <p className="text-anthracite/95 font-normal mb-1">{t('common:privacy.policy.page.036')}</p>
                  <p>{t('common:privacy.policy.page.037')}</p>
                </div>
              </div>
            </Section>

            <Section number="04" title={t('common:privacy.policy.page.038')}>
              <p>{t('common:privacy.policy.page.039')}</p>
              <p>{t('common:privacy.policy.page.040')}</p>
              <ul className="list-none space-y-1 text-anthracite/80 pl-4">
                <li>{t('common:privacy.policy.page.041')}<strong className="font-normal">{t('common:privacy.policy.page.042')}</strong>{t('common:privacy.policy.page.043')}</li>
                <li>{t('common:privacy.policy.page.044')}<strong className="font-normal">{t('common:privacy.policy.page.045')}</strong>{t('common:privacy.policy.page.046')}</li>
                <li>{t('common:privacy.policy.page.047')}<strong className="font-normal">{t('common:privacy.policy.page.048')}</strong></li>
                <li>{t('common:privacy.policy.page.049')}</li>
              </ul>
            </Section>

            <Section number="05" title={t('common:privacy.policy.page.050')}>
              <p>{t('common:privacy.policy.page.051')}</p>
              <p>{t('common:privacy.policy.page.052')}</p>
              <ul className="list-none space-y-1 text-anthracite/80 pl-4">
                <li>{t('common:privacy.policy.page.053')}</li>
                <li>{t('common:privacy.policy.page.054')}</li>
                <li>{t('common:privacy.policy.page.055')}</li>
              </ul>
              <p>{t('common:privacy.policy.page.056')}</p>
            </Section>

            <Section number="06" title={t('common:privacy.policy.page.057')}>
              <p>{t('common:privacy.policy.page.058')}</p>
              <ul className="list-none space-y-1.5 text-anthracite/80 pl-4">
                <li>— <strong className="font-normal text-anthracite/95">{t('common:privacy.policy.page.059')}</strong>{t('common:privacy.policy.page.060')}</li>
                <li>— <strong className="font-normal text-anthracite/95">{t('common:privacy.policy.page.061')}</strong>{t('common:privacy.policy.page.062')}</li>
                <li>— <strong className="font-normal text-anthracite/95">{t('common:privacy.policy.page.063')}</strong>{t('common:privacy.policy.page.064')}</li>
                <li>— <strong className="font-normal text-anthracite/95">{t('common:privacy.policy.page.065')}</strong>{t('common:privacy.policy.page.066')}</li>
                <li>— <strong className="font-normal text-anthracite/95">{t('common:privacy.policy.page.067')}</strong>{t('common:privacy.policy.page.068')}</li>
                <li>— <strong className="font-normal text-anthracite/95">{t('common:privacy.policy.page.069')}</strong>{t('common:privacy.policy.page.070')}</li>
                <li>— <strong className="font-normal text-anthracite/95">{t('common:privacy.policy.page.071')}</strong>{t('common:privacy.policy.page.072')}</li>
              </ul>
              <p>{t('common:privacy.policy.page.073')}<span className="text-anthracite/95">{t('common:privacy.policy.page.074')}</span>{t('common:privacy.policy.page.075')}</p>
            </Section>

            <Section number="07" title={t('common:privacy.policy.page.076')}>
              <p>{t('common:privacy.policy.page.077')}<strong className="font-normal text-anthracite/95">{t('common:privacy.policy.page.078')}</strong>.
              </p>
            </Section>

            <Section number="08" title={t('common:privacy.policy.page.079')}>
              <p>{t('common:privacy.policy.page.080')}</p>
              <p>{t('common:privacy.policy.page.081')}</p>
            </Section>

            <Section number="09" title={t('common:privacy.policy.page.082')}>
              <p>{t('common:privacy.policy.page.083')}</p>
            </Section>

            <Section number="10" title={t('common:privacy.policy.page.084')}>
              <p>{t('common:privacy.policy.page.085')}</p>
              <p>{t('common:privacy.policy.page.086')}</p>
            </Section>

          </div>

          {/* Bottom note */}
          <div className="mt-16 pt-10 border-t border-sand/60">
            <p className="text-[12px] tracking-[0.15em] text-stone/60 font-light text-center">{t('common:privacy.policy.page.087')}<span className="text-anthracite/55">{t('common:privacy.policy.page.088')}</span>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
