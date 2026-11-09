import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_URL } from './site';
import { absoluteUrl, findPageSeo } from './seoConfig';

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function setCanonical(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.rel = 'canonical';
    document.head.appendChild(element);
  }
  element.href = href;
}

// Keeps title, description, canonical and social tags in step with the route
// during client-side navigation; the first load already has them from the
// prerendered HTML.
export default function SeoManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const page = findPageSeo(pathname);
    if (!page) return;
    const url = absoluteUrl(page.path);
    const image = `${SITE_URL}${page.image}`;
    document.title = page.title;
    setMeta('name', 'description', page.description);
    setCanonical(url);
    setMeta('property', 'og:title', page.title);
    setMeta('property', 'og:description', page.description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', image);
    setMeta('name', 'twitter:title', page.title);
    setMeta('name', 'twitter:description', page.description);
    setMeta('name', 'twitter:image', image);
  }, [pathname]);

  return null;
}
