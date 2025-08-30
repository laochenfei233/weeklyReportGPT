import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SettingsContextType {
  // 主题设置
  theme: 'light' | 'dark' | 'auto';
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  
  // 字体设置
  fontSize: 'small' | 'medium' | 'large';
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  
  fontFamily: 'system' | 'serif' | 'mono';
  setFontFamily: (family: 'system' | 'serif' | 'mono') => void;
  
  // 语言设置
  locale: 'zh' | 'en';
  setLocale: (locale: 'zh' | 'en') => void;
  
  // 其他设置
  autoSave: boolean;
  setAutoSave: (enabled: boolean) => void;
  
  showLineNumbers: boolean;
  setShowLineNumbers: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  // 主题设置
  const [theme, setThemeState] = useState<'light' | 'dark' | 'auto'>('light');
  
  // 字体设置
  const [fontSize, setFontSizeState] = useState<'small' | 'medium' | 'large'>('medium');
  const [fontFamily, setFontFamilyState] = useState<'system' | 'serif' | 'mono'>('system');
  
  // 语言设置
  const [locale, setLocaleState] = useState<'zh' | 'en'>('zh');
  
  // 其他设置
  const [autoSave, setAutoSaveState] = useState(true);
  const [showLineNumbers, setShowLineNumbersState] = useState(false);

  // 从localStorage加载设置
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('app-settings');
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);
          setThemeState(settings.theme || 'light');
          setFontSizeState(settings.fontSize || 'medium');
          setFontFamilyState(settings.fontFamily || 'system');
          setLocaleState(settings.locale || 'zh');
          setAutoSaveState(settings.autoSave !== false);
          setShowLineNumbersState(settings.showLineNumbers || false);
        } catch (error) {
          console.error('Failed to load settings:', error);
        }
      }
    }
  }, []);

  // 保存设置到localStorage
  const saveSettings = (newSettings: any) => {
    if (typeof window !== 'undefined') {
      const currentSettings = {
        theme,
        fontSize,
        fontFamily,
        locale,
        autoSave,
        showLineNumbers,
        ...newSettings
      };
      localStorage.setItem('app-settings', JSON.stringify(currentSettings));
    }
  };

  const setTheme = (newTheme: 'light' | 'dark' | 'auto') => {
    setThemeState(newTheme);
    saveSettings({ theme: newTheme });
    
    // 应用主题到document
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      if (newTheme === 'dark') {
        root.classList.add('dark');
      } else if (newTheme === 'light') {
        root.classList.remove('dark');
      } else {
        // auto模式根据系统偏好
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    }
  };

  const setFontSize = (newSize: 'small' | 'medium' | 'large') => {
    setFontSizeState(newSize);
    saveSettings({ fontSize: newSize });
    
    // 应用字体大小到document
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('text-sm', 'text-base', 'text-lg');
      switch (newSize) {
        case 'small':
          root.classList.add('text-sm');
          break;
        case 'large':
          root.classList.add('text-lg');
          break;
        default:
          root.classList.add('text-base');
      }
    }
  };

  const setFontFamily = (newFamily: 'system' | 'serif' | 'mono') => {
    setFontFamilyState(newFamily);
    saveSettings({ fontFamily: newFamily });
    
    // 应用字体到document
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('font-sans', 'font-serif', 'font-mono');
      switch (newFamily) {
        case 'serif':
          root.classList.add('font-serif');
          break;
        case 'mono':
          root.classList.add('font-mono');
          break;
        default:
          root.classList.add('font-sans');
      }
    }
  };

  const setLocale = (newLocale: 'zh' | 'en') => {
    setLocaleState(newLocale);
    saveSettings({ locale: newLocale });
  };

  const setAutoSave = (enabled: boolean) => {
    setAutoSaveState(enabled);
    saveSettings({ autoSave: enabled });
  };

  const setShowLineNumbers = (enabled: boolean) => {
    setShowLineNumbersState(enabled);
    saveSettings({ showLineNumbers: enabled });
  };

  return (
    <SettingsContext.Provider value={{
      theme,
      setTheme,
      fontSize,
      setFontSize,
      fontFamily,
      setFontFamily,
      locale,
      setLocale,
      autoSave,
      setAutoSave,
      showLineNumbers,
      setShowLineNumbers
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}