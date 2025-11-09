import Link from 'next/link';
import { Trophy, Calendar, History, Shield } from 'lucide-react';

interface NavigationProps {
  activePage: 'home' | 'fixtures' | 'history' | 'admin';
}

export default function Navigation({ activePage }: NavigationProps) {
  return (
    <nav className="bg-white dark:bg-zinc-900 shadow-md border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
            <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400" />
            <h1 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">
              Brotherhood FC
            </h1>
          </Link>
          <div className="flex gap-1 sm:gap-2">
            <Link 
              href="/" 
              className={`px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg flex items-center gap-1.5 sm:gap-2 transition-colors min-h-[44px] sm:min-h-[48px] ${
                activePage === 'home'
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Trophy className="w-5 h-5 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">คะแนน</span>
            </Link>
            <Link 
              href="/fixtures" 
              className={`px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg flex items-center gap-1.5 sm:gap-2 transition-colors min-h-[44px] sm:min-h-[48px] ${
                activePage === 'fixtures'
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Calendar className="w-5 h-5 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">แมตช์</span>
            </Link>
            <Link 
              href="/history" 
              className={`px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg flex items-center gap-1.5 sm:gap-2 transition-colors min-h-[44px] sm:min-h-[48px] ${
                activePage === 'history'
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <History className="w-5 h-5 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">ประวัติ</span>
            </Link>
            <Link 
              href="/admin/login" 
              className={`px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg flex items-center gap-1.5 sm:gap-2 transition-colors min-h-[44px] sm:min-h-[48px] ${
                activePage === 'admin'
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Shield className="w-5 h-5 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
