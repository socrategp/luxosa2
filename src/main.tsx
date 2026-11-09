import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/cormorant-garamond/latin-300.css'
import '@fontsource/cormorant-garamond/latin-300-italic.css'
import '@fontsource/cormorant-garamond/latin-400.css'
import '@fontsource/cormorant-garamond/latin-400-italic.css'
import '@fontsource/cormorant-garamond/latin-500.css'
import '@fontsource/cormorant-garamond/latin-500-italic.css'
import '@fontsource/cormorant-garamond/latin-600.css'
import '@fontsource/cormorant-garamond/latin-700.css'
import '@fontsource/jost/latin-300.css'
import '@fontsource/jost/latin-300-italic.css'
import '@fontsource/jost/latin-400.css'
import '@fontsource/jost/latin-400-italic.css'
import '@fontsource/jost/latin-500.css'
import '@fontsource/jost/latin-600.css'
import './index.css'
import i18n from './i18n'
import { loadLanguage } from './i18n/loadLanguage'
import App from './App.tsx'

const render = () =>
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )

// Re-applying the language after its bundle arrives refreshes i18n.resolvedLanguage,
// which was computed at init when only Italian was available.
loadLanguage(i18n.language)
  .then(() => i18n.changeLanguage(i18n.language))
  .catch(() => i18n.changeLanguage('it'))
  .finally(render)
