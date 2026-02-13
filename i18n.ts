import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  return {
    // 确保locale存在，否则使用默认值
    messages: locale ? (await import(`./messages/${locale}.json`)).default : {}
  };
});
