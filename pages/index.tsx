import { AnimatePresence, motion } from "framer-motion";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useTranslations } from 'next-intl'
import { Toaster, toast } from "react-hot-toast";
import DropDown, { FormType } from "../components/DropDown";
import Footer from "../components/Footer";
import Github from "../components/GitHub";

import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import ResizablePanel from "../components/ResizablePanel";
import { marked } from "marked";

const Home: NextPage = () => {
  const t = useTranslations('Index')

  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState("");
  const [form, setForm] = useState<FormType>("paragraphForm");
  const [api_key, setAPIKey] = useState("")
  const [generatedChat, setGeneratedChat] = useState<String>("");
  const [renderedHtml, setRenderedHtml] = useState<string>("");

  // 当generatedChat改变时，渲染markdown
  useEffect(() => {
    if (generatedChat && generatedChat.length > 0) {
      const renderMarkdown = async () => {
        try {
          console.log('Rendering markdown:', generatedChat.toString());
          
          // 配置marked选项
          const markedOptions = {
            gfm: true,
            breaks: true,
            sanitize: false,
            smartLists: true,
            smartypants: false
          };
          
          // 尝试同步渲染
          const result = marked.parse(generatedChat.toString(), markedOptions);
          console.log('Rendered HTML:', result);
          
          if (typeof result === 'string') {
            setRenderedHtml(result);
          } else if (result instanceof Promise) {
            const resolvedResult = await result;
            setRenderedHtml(typeof resolvedResult === 'string' ? resolvedResult : generatedChat.toString());
          } else {
            setRenderedHtml(generatedChat.toString());
          }
        } catch (error) {
          console.error('Markdown rendering error:', error);
          // 如果渲染失败，至少显示原始内容
          setRenderedHtml(`<pre>${generatedChat.toString()}</pre>`);
        }
      };
      renderMarkdown();
    } else {
      setRenderedHtml('');
    }
  }, [generatedChat]);

  console.log("Streamed response: ", generatedChat);

  const prompt =
    form === 'paragraphForm'?
      `${chat}`
      : `${chat}`;

  const useUserKey = process.env.NEXT_PUBLIC_USE_USER_KEY === "true" ? true : false;

  const generateChat = async (e: any) => {
    e.preventDefault();
    setGeneratedChat("");
    setLoading(true);
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
    const response = useUserKey ?
      await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          api_key,
        }),
      })
    :
      await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
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

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value).replace("<|im_end|>", "");
      setGeneratedChat((prev) => prev + chunkValue);
    }

    setLoading(false);
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>{t('title')}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
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
            <Image
              src="/1-black.png"
              width={30}
              height={30}
              alt="1 icon"
              className="mb-5 xs:mb-0"
            />
            <p className="text-left font-medium">
              {t('step1')}{" "}
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
                  <div className="space-y-8 flex flex-col max-w-4xl mx-auto">
                    <div className="content-container w-full">
                      {/* 复制按钮区域 */}
                      <div className="copy-buttons">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(generatedChat.trim());
                            toast("已复制纯文本内容", {
                              icon: "📋",
                            });
                          }}
                          className="copy-button plain"
                        >
                          📋 复制纯文本
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              // 创建一个临时的div来获取HTML内容
                              const tempDiv = document.createElement('div');
                              const markedResult = await marked(generatedChat.toString(), {
                                gfm: true,
                                breaks: true
                              });
                              tempDiv.innerHTML = typeof markedResult === 'string' ? markedResult : '';
                              
                              // 使用Clipboard API复制HTML格式
                              const htmlContent = tempDiv.innerHTML;
                              const plainContent = generatedChat.trim();
                              
                              if (navigator.clipboard && window.ClipboardItem) {
                                const clipboardItem = new ClipboardItem({
                                  'text/html': new Blob([htmlContent], { type: 'text/html' }),
                                  'text/plain': new Blob([plainContent], { type: 'text/plain' })
                                });
                                navigator.clipboard.write([clipboardItem]).then(() => {
                                  toast("已复制带格式内容", {
                                    icon: "✨",
                                  });
                                }).catch(() => {
                                  // 降级到纯文本复制
                                  navigator.clipboard.writeText(plainContent);
                                  toast("已复制纯文本内容", {
                                    icon: "📋",
                                  });
                                });
                              } else {
                                // 降级到纯文本复制
                                navigator.clipboard.writeText(plainContent);
                                toast("已复制纯文本内容", {
                                  icon: "📋",
                                });
                              }
                            } catch (error) {
                              // 如果出错，降级到纯文本复制
                              navigator.clipboard.writeText(generatedChat.trim());
                              toast("已复制纯文本内容", {
                                icon: "📋",
                              });
                            }
                          }}
                          className="copy-button formatted"
                        >
                          ✨ 复制带格式
                        </button>
                      </div>
                      
                      {/* 内容区域 */}
                      <div className="content-body">
                        <div
                          className="prose"
                          dangerouslySetInnerHTML={{
                            __html: renderedHtml,
                          }}
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
