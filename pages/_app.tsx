import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import { IntlProvider } from 'next-intl'
import "../styles/globals.css";
import "../styles/markdown.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <IntlProvider
      messages={pageProps.messages}
      locale={pageProps.locale || 'en'}
      >
      <Component {...pageProps} />
      <Analytics />
    </IntlProvider>
  );
}


export default MyApp;
