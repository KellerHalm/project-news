import { Home } from 'lucide-react';
import Link from 'next/link';

import { routes } from '@/shared/constants';

export function BottomNav() {
  return (
    <nav className="fixed bottom-[-2px] left-0 right-0 bg-background border-t border-gray-200 md:hidden flex justify-between px-4 py-3 rounded-t-xl">
      <Link href={routes.home} className="flex flex-col items-center gap-y-0.5">
        <Home className="h-6 w-6" />
        <span className="text-xs">Главная</span>
      </Link>
    </nav>
  );
}
