import React from 'react';
import { LayoutDashboard, Map, Info } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col transition-colors duration-200">
            <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Map className="w-6 h-6 text-scotland-blue" />
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Scottish Demographics</h1>
                    </div>
                    <nav className="hidden md:flex items-center gap-6">
                        <a href="#" className="text-slate-600 hover:text-scotland-blue dark:text-slate-300 dark:hover:text-scotland-blue font-medium flex items-center gap-2">
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                        </a>
                        <a href="#" className="text-slate-600 hover:text-scotland-blue dark:text-slate-300 dark:hover:text-scotland-blue font-medium flex items-center gap-2">
                            <Info className="w-4 h-4" />
                            About
                        </a>
                        <ThemeToggle />
                    </nav>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {children}
            </main>

            <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-6 transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                    <p>© {new Date().getFullYear()} Scottish Demographics Visualization. Data source: National Records of Scotland & Scotland's Census 2022.</p>
                </div>
            </footer>
        </div>
    );
};
