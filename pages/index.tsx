import { AnimatePresence, motion } from "framer-motion";
import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useTranslations } from 'next-intl'
import { Toaster, toast } from "react-hot-toast";
import Footer from "../components/Footer";
import Github from "../components/GitHub";
import SettingsModal from "../components/SettingsModal";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import ResizablePanel from "../components/ResizablePanel";
import MarkdownRenderer from "../components/MarkdownRenderer";
import { useSettings } from "../contexts/SettingsContext";
import { useAuthState } from "../hooks/useAuth";

interface UserSettings {
  fontSize: 'small' | 'medium' | 'large';
  responseStyle: 'professional' | 'casual' | 'detailed' | 'concise';
  language: 'zh' | 'en';
  customModel: string;
  customApiBase: string;
  customApiKey: string;
  useCustomConfig: boolean;
}

const Home: NextPage = () => {
  const t = useTranslations('Index')
  const { user, isLoading: authLoading } = useAuthState();

  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState("");
  const [api_key, setAPIKey] = useState("")
  const [generatedChat, setGeneratedChat] = useState<String>("");
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [reportType, setReportType] = useState<"daily" | "weekly" | "monthly">("weekly");
  
  // 使用设置上下文
  const { locale, autoSave, showLineNumbers } = useSettings();

  // 加载用户设置
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        setUserSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to parse user settings:', error);
      }
    }
  }, []);



  console.log("Streamed response: ", generatedChat);

  // 根据用户设置构建提示词
  const getStyledPrompt = (content: string) => {
    if (!userSettings) return content;
    
    const stylePrompts = {
      professional: "请用专业正式的商务语言",
      casual: "请用轻松友好的语调",
      detailed: "请提供详细完整的描述和分析",
      concise: "请简洁扼要地突出重点"
    };
    
    const reportTypePrompts = {
      daily: "请生成一份详细的工作日报",
      weekly: "请生成一份完整的工作周报",
      monthly: "请生成一份全面的工作月报"
    };
    
    const typeInstruction = reportTypePrompts[reportType];
    const styleInstruction = stylePrompts[userSettings.responseStyle];
    return `${typeInstruction}，${styleInstruction}，${content}`;
  };

  const prompt = getStyledPrompt(chat);
  const useUserKey = process.env.NEXT_PUBLIC_USE_USER_KEY === "true" ? true : false;

  const generateChat = async (e: any) => {
    e.preventDefault();
    setGeneratedChat("");
    setLoading(true);

    // 检查API配置
    const hasSystemKey = process.env.NEXT_PUBLIC_USE_USER_KEY !== "true";
    const hasUserConfig = userSettings?.useCustomConfig && userSettings.customApiKey;
    const hasUserKey = useUserKey && api_key;
    
    if (!hasUserConfig && !hasSystemKey && !hasUserKey) {
      toast.error("请先配置API密钥");
      setShowSettings(true);
      setLoading(false);
      return;
    }

    if (useUserKey && api_key == ""){
      toast.error(t("API_KEY_NULL_ERROR"))
      setLoading(false)
      return
    }
    if (chat == ""){
      toast.error(t("CONTENT_NULL_ERROR"))
      setLoading(false)
      return
    }
    // 构建请求体
    const requestBody: any = { prompt };
    
    // 如果启用了用户密钥模式，添加API密钥
    if (useUserKey) {
      requestBody.api_key = api_key;
    }
    
    // 如果用户配置了自定义设置，添加自定义配置
    if (userSettings?.useCustomConfig) {
      requestBody.customConfig = {
        apiKey: userSettings.customApiKey,
        apiBase: userSettings.customApiBase,
        model: userSettings.customModel
      };
    }

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      credentials: 'include'
    })

    console.log("Edge function returned.");

    if (!response.ok) {
      try {
        const errorData = await response.json();
        
        const errorMessage = errorData.error || "服务繁忙，请稍后再试";
        toast.error(errorMessage);
        console.error("API Error:", errorData);
      } catch (e) {
        toast.error("服务繁忙，请稍后再试");
        console.error("Failed to parse error response:", e);
      }
      setLoading(false);
      return;
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let lastChunkTime = Date.now();
    const timeoutDuration = 15000; // 15秒无数据则认为超时

    try {
      while (!done) {
        // 设置读取超时
        const readPromise = reader.read();
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Stream timeout')), timeoutDuration);
        });

        const result = await Promise.race([readPromise, timeoutPromise]) as ReadableStreamReadResult<Uint8Array>;
        
        const { value, done: doneReading } = result;
        done = doneReading;
        
        if (value) {
          lastChunkTime = Date.now();
          const chunkValue = decoder.decode(value).replace("<|im_end|>", "");
          setGeneratedChat((prev) => prev + chunkValue);
        }
      }
    } catch (error) {
      console.error("Stream error:", error);
      if (error instanceof Error && error.message === 'Stream timeout') {
        toast.error("生成超时，但已保存当前内容");
      } else {
        toast.error("流式传输中断，已保存当前内容");
      }
    } finally {
      reader.releaseLock();
    }

    setLoading(false);
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>{t('title')}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header 
        onSettingsClick={() => setShowSettings(true)}
      />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        


      <a
          className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 shadow-md transition-colors hover:bg-gray-100 mb-5"
          href="https://github.com/laochenfei233/weeklyReportGPT"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github />
          <p>Star on GitHub</p>
        </a>



        <h1 className="sm:text-6xl text-4xl max-w-2xl font-bold text-slate-900">
          {t('description1')} <br></br><div className=" px-4 py-2 sm:mt-3 mt-8  w-full"></div>{t('description2')}
        </h1>
        <p className="text-slate-500 mt-5">{t('slogan')}</p>

        {/* 管理员状态显示 */}
        {user && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-800">
                  {locale === 'zh' ? '欢迎回来，管理员' : 'Welcome back, Administrator'}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {locale === 'zh' ? '✅ 管理员账户，无Token限制' : '✅ Administrator account, unlimited tokens'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 未登录提示 */}
        {!authLoading && !user && (
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200 max-w-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-800">
                  {locale === 'zh' ? 'Token使用限制：每用户1万Token' : 'Token Limit: 10,000 tokens per user'}
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  {locale === 'zh' 
                    ? '点击右上角设置按钮进行管理员登录或配置自定义API以解除限制' 
                    : 'Click settings to login as admin or configure custom API to remove limits'
                  }
                </p>
              </div>
            </div>
          </div>
        )}



        <div className="max-w-xl w-full">
        { useUserKey &&(
            <>
              <div className="flex mt-10 items-center space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#000" d="M7 14q-.825 0-1.412-.588Q5 12.825 5 12t.588-1.413Q6.175 10 7 10t1.412.587Q9 11.175 9 12q0 .825-.588 1.412Q7.825 14 7 14Zm0 4q-2.5 0-4.25-1.75T1 12q0-2.5 1.75-4.25T7 6q1.675 0 3.038.825Q11.4 7.65 12.2 9H21l3 3l-4.5 4.5l-2-1.5l-2 1.5l-2.125-1.5H12.2q-.8 1.35-2.162 2.175Q8.675 18 7 18Zm0-2q1.4 0 2.463-.85q1.062-.85 1.412-2.15H14l1.45 1.025L17.5 12.5l1.775 1.375L21.15 12l-1-1h-9.275q-.35-1.3-1.412-2.15Q8.4 8 7 8Q5.35 8 4.175 9.175Q3 10.35 3 12q0 1.65 1.175 2.825Q5.35 16 7 16Z"/></svg>
                <p className="text-left font-medium">
                  {t('step0')}{" "}

                </p>
              </div>
              <input
                  value={api_key}
                  onChange={(e) => setAPIKey(e.target.value)}
                  className="w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-black focus:ring-black p-2"
                  placeholder={
                    t('openaiApiKeyPlaceholder')
                  }
                />
            </>)
          }

          <div className="flex mt-10 items-center space-x-3">
            <p className="text-left font-medium">
              📝 {t('step1')}{" "}
            </p>
          </div>

          <textarea
            value={chat}
            onChange={(e) => setChat(e.target.value)}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-2"
            placeholder={
              t('placeholder')
            }
          />

          <div className="flex justify-center space-x-4 my-4">
            <button 
              className={`px-4 py-2 rounded-md ${reportType === 'daily' ? 'bg-black text-white' : 'bg-gray-200'}`}
              onClick={() => setReportType('daily')}
            >
              日报
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${reportType === 'weekly' ? 'bg-black text-white' : 'bg-gray-200'}`}
              onClick={() => setReportType('weekly')}
            >
              周报
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${reportType === 'monthly' ? 'bg-black text-white' : 'bg-gray-200'}`}
              onClick={() => setReportType('monthly')}
            >
              月报
            </button>
          </div>

          {!loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-5 mt-8 hover:bg-black/80 w-full"
              onClick={(e) => generateChat(e)}
            >
              {t('simplifierButton')} &rarr;
            </button>
          )}
          {loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          )}
          <br></br>
          <br></br>
          <div className="mt-1 items-center space-x-3">
            <span className="text-slate-200">
                {t('privacyPolicy1')}
              <a
                className="text-blue-200 hover:text-blue-400"
                href="https://github.com/laochenfei233/weeklyReportGPT/blob/main/privacy.md"
                target="_blank"
                rel="noopener noreferrer"
              >{' '}{t('privacyPolicy2')}</a>
            </span>
            <br></br>
            




          </div>
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <ResizablePanel>
          <AnimatePresence mode="wait">
            <motion.div className="space-y-10 my-10">
              {generatedChat && (
                <>
                  <div>
                    <h2 className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto">
                      {t('simplifiedContent')}
                    </h2>
                  </div>
                  <div className="space-y-8 flex flex-col items-center justify-center max-w-4xl mx-auto">
                    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden typora-container">
                      {/* Typora风格的工具栏 */}
                      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex justify-between items-center">
                        <div className="text-sm text-gray-600 font-medium">周报内容</div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(generatedChat.trim());
                            toast("已复制完整周报内容", {
                              icon: "✂️",
                            });
                          }}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                          复制内容
                        </button>
                      </div>
                      
                      {/* Typora风格的内容区域 */}
                      <div className={`p-8 bg-white min-h-[400px] ${
                        userSettings?.fontSize === 'small' ? 'text-sm' :
                        userSettings?.fontSize === 'large' ? 'text-lg' : 'text-base'
                      }`}>
                        <MarkdownRenderer
                          content={generatedChat.toString()}
                          loading={loading}
                          className="sty1 markdown-body"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
      </main>
      <Footer />

      {/* 设置弹窗 */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </div>
  );
};

export default Home;

export function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      messages: {
        ...require(`../messages/${locale}.json`),
      },
    },
  }
}
