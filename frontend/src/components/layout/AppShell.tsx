import { ReactNode } from 'react';
import { Compass } from 'lucide-react';

interface AppShellProps {
    children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
    return (
        <div className="min-h-screen bg-slate-100 text-slate-900">
            <header className="app-header">
                <div className="app-header__brand">
                    <div className="brand-mark" aria-hidden="true">
                        <Compass size={21} strokeWidth={2.2} />
                    </div>
                    <div>
                        <h1 className="app-title">EcoRisk-GIS AI</h1>
                        <p className="app-subtitle">India-focused Environmental Site Assessment &amp; Decision Support</p>
                    </div>
                </div>
                <div className="prototype-status">
                    <span className="prototype-status__dot" aria-hidden="true" />
                    <span>Decision-Support Prototype</span>
                </div>
            </header>
            <main className="app-main">{children}</main>
        </div>
    );
}