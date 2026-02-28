import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-200 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1">
                        <Link href="/" className="font-semibold text-lg text-slate-900">Touch Memories</Link>
                        <p className="mt-4 text-sm text-slate-500 leading-relaxed">
                            Зберігаємо ваші найкращі спогади у фізичному форматі. Преміальна якість друку та матеріалів.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-medium text-slate-900 mb-4">Меню</h3>
                        <ul className="space-y-3">
                            <li><Link href="/catalog" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Каталог продукції</Link></li>
                            <li><Link href="/about" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Про нас</Link></li>
                            <li><Link href="/reviews" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Відгуки клієнтів</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-medium text-slate-900 mb-4">Клієнтам</h3>
                        <ul className="space-y-3">
                            <li><Link href="/delivery" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Оплата та Доставка</Link></li>
                            <li><Link href="/returns" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Повернення</Link></li>
                            <li><Link href="/oferta" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Публічна оферта</Link></li>
                            <li><Link href="/privacy" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Політика конфіденційності</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-medium text-slate-900 mb-4">Контакти</h3>
                        <ul className="space-y-3 text-sm text-slate-500">
                            <li>Україна, м. Київ</li>
                            <li><a href="mailto:hello@touchmemories.ua" className="hover:text-slate-900 transition-colors">hello@touchmemories.ua</a></li>
                            <li><a href="tel:+380671234567" className="hover:text-slate-900 transition-colors">+380 (67) 123 45 67</a></li>
                        </ul>
                        <div className="mt-6 flex gap-4">
                            {/* Instagram Icon */}
                            <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-slate-400">
                        &copy; {new Date().getFullYear()} Touch Memories. Всі права захищені.
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-medium tracking-wide">SECURE CHECKOUT</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
