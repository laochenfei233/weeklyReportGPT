import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import { IntlProvider } from 'next-intl'
import "../styles/globals.css";
import "../styles/markdown.css";
import { useEffect, useState } from 'react';
import UsageRulesModal from '../components/UsageRulesModal';
import { SettingsProvider } from '../contexts/SettingsContext';

function MyApp({ Component, pageProps }: AppProps) {
  const [showRulesModal, setShowRulesModal] = useState(false);

  // 检查是否首次访问
  useEffect(() => {
    const hasSeenRules = localStorage.getItem('hasSeenRules');
    if (hasSeenRules !== 'true') {
      setShowRulesModal(true);
    }
  }, []);

  const handleCloseRulesModal = () => {
    setShowRulesModal(false);
    localStorage.setItem('hasSeenRules', 'true');
  };

  return (
    <SettingsProvider>
      <IntlProvider
        messages={pageProps.messages}
        locale={pageProps.locale || 'en'}
        >
        <Component {...pageProps} />
        <Analytics />
        <UsageRulesModal
          isOpen={showRulesModal}
          onClose={handleCloseRulesModal}
        />
      </IntlProvider>
    </SettingsProvider>
  );
}

export default MyApp;
