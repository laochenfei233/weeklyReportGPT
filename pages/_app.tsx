import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import { IntlProvider } from 'next-intl'
import "../styles/globals.css";
import "../styles/markdown.css";
import { SettingsProvider } from '../contexts/SettingsContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SettingsProvider>
      <IntlProvider
        messages={pageProps.messages}
        locale={pageProps.locale || 'en'}
        >
        <Component {...pageProps} />
        <Analytics />
      </IntlProvider>
    </SettingsProvider>
  );
}

export default MyApp;
