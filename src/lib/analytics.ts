declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

const gtag = typeof window !== 'undefined' ? window.gtag : () => {};

export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Événements spécifiques WindVenture
export const trackBookingStart = (packageName: string) => {
  trackEvent('booking_start', 'booking', packageName);
};

export const trackBookingComplete = (packageName: string, value: number) => {
  trackEvent('purchase', 'booking', packageName, value);
};

export const trackPackageView = (packageName: string) => {
  trackEvent('view_item', 'packages', packageName);
};

export const trackContactForm = () => {
  trackEvent('form_submit', 'contact', 'contact_form');
};

export const trackWhatsAppClick = () => {
  trackEvent('click', 'contact', 'whatsapp_button');
};

export const trackPageView = (pagePath: string) => {
  trackEvent('page_view', 'navigation', pagePath);
};
