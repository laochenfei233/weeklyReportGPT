import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import { IntlProvider } from 'next-intl'
import "../styles/globals.css";
import "../styles/markdown.css";
import { SettingsProvider } from '../contexts/SettingsContext';
import { ThemeProvider } from '../contexts/ThemeContext';

function MyApp({ Component, pageProps }: AppProps) {
  // 确保messages和locale存在
  const messages = pageProps.messages || {};
  const locale = pageProps.locale || 'en';
  
  return (
    <SettingsProvider>
      <ThemeProvider>
        <IntlProvider
          messages={messages}
          locale={locale}
          timeZone="Asia/Shanghai"
          >
          <Component {...pageProps} />
          <Analytics />
        </IntlProvider>
      </ThemeProvider>
    </SettingsProvider>
  );
}

export default MyApp;
