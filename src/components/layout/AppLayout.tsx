import type { ReactNode } from 'react';
import { Header } from './Header';

interface AppLayoutProps {
  inputPanel: ReactNode;
  resultsPanel: ReactNode;
}

export function AppLayout({ inputPanel, resultsPanel }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Header />
      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-4 py-6">
        <div className="grid grid-cols-12 gap-0 h-full">
          {/* Input Panel: 4 columns */}
          <div className="col-span-12 lg:col-span-4 lg:pr-6">
            {inputPanel}
          </div>
          {/* Results Panel: 8 columns */}
          <div className="col-span-12 lg:col-span-8 lg:border-l lg:border-gray-800 lg:pl-6">
            {resultsPanel}
          </div>
        </div>
      </main>
    </div>
  );
}
