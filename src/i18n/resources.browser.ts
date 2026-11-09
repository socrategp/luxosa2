// Browser build only (aliased in vite.config.ts): ships Italian, the default
// and fallback language. Other languages load on demand via loadLanguage.ts.
// The server keeps using resources.ts, which holds every language.
import itCommon from './locales/it/common.json' with { type: 'json' }
import itEsperienze from './locales/it/esperienze.json' with { type: 'json' }
import itForms from './locales/it/forms.json' with { type: 'json' }
import itHome from './locales/it/home.json' with { type: 'json' }
import itMessinaCavour from './locales/it/messina-cavour.json' with { type: 'json' }
import itPercorsi from './locales/it/percorsi.json' with { type: 'json' }
import itReport from './locales/it/report.json' with { type: 'json' }
import itTest from './locales/it/test.json' with { type: 'json' }

export const resources = {
  it: {
    common: itCommon,
    esperienze: itEsperienze,
    forms: itForms,
    home: itHome,
    'messina-cavour': itMessinaCavour,
    percorsi: itPercorsi,
    report: itReport,
    test: itTest,
  },
}
