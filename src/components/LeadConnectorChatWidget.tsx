import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const WIDGET_ROUTE = '/sedi/messina-cavour';
const WIDGET_ID = '6a0f5db53e715fb5ddf2bf11';
const LOADER_URL = 'https://widgets.leadconnectorhq.com/loader.js';
const RESOURCES_URL = 'https://widgets.leadconnectorhq.com/chat-widget/loader.js';

function removeWidget() {
  document
    .querySelectorAll<HTMLScriptElement>(`script[data-widget-id="${WIDGET_ID}"]`)
    .forEach((script) => script.remove());

  document
    .querySelectorAll('chat-widget')
    .forEach((widget) => widget.remove());
}

export default function LeadConnectorChatWidget() {
  const { pathname } = useLocation();

  useEffect(() => {
    removeWidget();

    if (pathname !== WIDGET_ROUTE) {
      const observer = new MutationObserver(removeWidget);
      observer.observe(document.body, { childList: true, subtree: true });
      return () => observer.disconnect();
    }

    const script = document.createElement('script');
    script.src = LOADER_URL;
    script.setAttribute('data-resources-url', RESOURCES_URL);
    script.setAttribute('data-widget-id', WIDGET_ID);
    document.body.appendChild(script);

    return removeWidget;
  }, [pathname]);

  return null;
}
