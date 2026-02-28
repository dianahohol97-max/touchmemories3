import Link from 'next/link';

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-slate-900 to-slate-700 flex flex-col items-center justify-center text-white font-bold text-xs ring-2 ring-transparent group-hover:ring-slate-300 transition-all">
                        TM
                    </div>
                    <span className="font-semibold text-xl tracking-tight text-slate-900">Touch Memories</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/catalog" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Каталог</Link>
                    <Link href="/about" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Про нас</Link>
                    <Link href="/delivery" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Доставка</Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <Link href="/cart" className="relative p-2 rounded-full hover:bg-slate-100 transition-colors group">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-600 group-hover:text-slate-900">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500"></span>
                    </Link>

                    <button className="md:hidden p-2 text-slate-600 hover:text-slate-900">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
}
