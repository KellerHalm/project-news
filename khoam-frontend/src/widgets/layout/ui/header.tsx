'use client';

import { X } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { routes } from '@/shared/constants';
import { BarsIcon } from '@/shared/icons/24';
import { LogoIcon } from '@/shared/images';
import { Button } from '@/shared/ui';

const menuItems = [
  { title: 'Новости' },
  { title: 'Спорт' },
  { title: 'Бизнес' },
  { title: 'Инновации' },
  { title: 'Искусство' },
  { title: 'Путешествие' },
  { title: 'Более' }
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-10 bg-white">
      <div className="relative mx-auto flex max-w-[1312px] items-center justify-between px-4 py-6">
        <Link href={routes.home} onClick={() => setIsMenuOpen(false)}>
          <LogoIcon />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {menuItems.map(item => (
            <Link
              key={item.title}
              href="#"
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button variant="outline" size="lg" asChild>
            <Link href={routes.login}>Вход</Link>
          </Button>
          <Button variant="default" size="lg" asChild>
            <Link href={routes.register}>Регистрация</Link>
          </Button>
        </div>

        <div onClick={() => setIsMenuOpen(open => !open)} className="lg:hidden">
          {isMenuOpen ? (
            <X className="stroke-(--neutral-70)" />
          ) : (
            <BarsIcon className="[&_path]:fill-(--neutral-70)" />
          )}
        </div>

        {isMenuOpen && (
          <div
            id="mobile-menu"
            className="absolute inset-x-0 top-full bg-white px-4 pb-6 shadow-lg lg:hidden"
          >
            <nav className="flex flex-col">
              {menuItems.map(item => (
                <Link
                  key={item.title}
                  href="#"
                  className="py-3 text-sm text-gray-600 hover:text-gray-900"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
            </nav>

            <div className="mt-4 flex flex-col gap-3">
              <Button variant="outline" size="lg" asChild>
                <Link href={routes.login} onClick={() => setIsMenuOpen(false)}>
                  Вход
                </Link>
              </Button>
              <Button variant="default" size="lg" asChild>
                <Link
                  href={routes.register}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Регистрация
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
