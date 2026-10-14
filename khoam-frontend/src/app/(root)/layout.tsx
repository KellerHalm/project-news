import React from 'react';

import { BottomNav, Footer, Header } from '@/widgets/layout';

export default function MainLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 max-w-[928px] mx-auto py-8 pb-20 w-full">
        {children}
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
