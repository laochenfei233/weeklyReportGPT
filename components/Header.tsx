import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Github from "./GitHub";
import { useAuthState } from "../hooks/useAuth";
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  onSettingsClick?: () => void;
}

export default function Header({ onSettingsClick }: HeaderProps) {
  const t = useTranslations('Index')
  const { user } = useAuthState();

  return (
    <header className="flex justify-between items-center w-full mt-5 border-b-2 pb-7 sm:px-4 px-2">
      <Link href="/" className="flex space-x-3">
        <Image
          alt="header text"
          src="/icon.svg"
          className="sm:w-12 sm:h-12 w-8 h-8"
          width={32}
          height={32}
        />
        <h1 className="sm:text-4xl text-2xl font-bold ml-2 tracking-tight">
          {t('title')}
        </h1>
      </Link>
      <div className="flex items-center gap-4">
        {/* 设置按钮 */}
        <button
          onClick={onSettingsClick}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          title="设置"
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </button>

        {/* 管理员状态显示 */}
        {user && (
          <div className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
              管
            </div>
            <span className="hidden sm:block">管理员</span>
          </div>
        )}

        {/* GitHub链接 */}
        <Github />
      </div>


    </header>
  );
}
