import Link from 'next/link';

export default function CartPage() {
    // Static placeholder data for the UI
    // Real implementation requires Context API or Zustand to store cart state
    const mockCartItems = [
        {
            id: "1",
            name: "Полароїдні фотокартки (24 шт)",
            priceUah: 49900,
            quantity: 1,
            options: "Формат: Polaroid (10x12 см)"
        },
        {
            id: "2",
            name: "Фотокнига Classic",
            priceUah: 129900,
            quantity: 2,
            options: "Обкладинка: Тверда, Сторінок: 24"
        }
    ];

    const subtotal = mockCartItems.reduce((acc, item) => acc + (item.priceUah * item.quantity), 0);

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-8">Мій кошик</h1>

                {mockCartItems.length > 0 ? (
                    <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">

                        {/* Cart Items List */}
                        <div className="lg:col-span-7 xl:col-span-8">
                            <ul className="border-t border-b border-slate-200 divide-y divide-slate-200">
                                {mockCartItems.map((item) => (
                                    <li key={item.id} className="flex py-6 sm:py-8">
                                        {/* Item Image Placeholder */}
                                        <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-slate-100 rounded-xl overflow-hidden relative border border-slate-200">
                                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px]"></div>
                                        </div>

                                        <div className="ml-4 sm:ml-6 flex-1 flex flex-col justify-between">
                                            <div className="flex justify-between relative pr-9 sm:pr-0">
                                                <div>
                                                    <h3 className="text-base font-medium text-slate-900">
                                                        {item.name}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-slate-500">{item.options}</p>
                                                </div>
                                                <p className="text-base font-medium text-slate-900 ml-4">
                                                    {(item.priceUah / 100).toLocaleString('uk-UA')} ₴
                                                </p>
                                            </div>

                                            <div className="mt-4 flex items-center justify-between">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center border border-slate-200 rounded-full bg-white">
                                                    <button type="button" className="p-2 text-slate-400 hover:text-slate-500 rounded-l-full">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                                                    </button>
                                                    <span className="px-4 text-sm font-medium text-slate-900 w-10 text-center">{item.quantity}</span>
                                                    <button type="button" className="p-2 text-slate-400 hover:text-slate-500 rounded-r-full">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                                    </button>
                                                </div>

                                                {/* Remove Button */}
                                                <button type="button" className="text-sm font-medium text-rose-600 hover:text-rose-500 flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    <span className="hidden sm:inline">Видалити</span>
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Order Summary */}
                        <div className="mt-10 lg:mt-0 lg:col-span-5 xl:col-span-4 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
                            <h2 className="text-lg font-medium text-slate-900 mb-6">Ваше замовлення</h2>

                            <dl className="space-y-4 text-sm text-slate-600 mb-6 border-b border-slate-200 pb-6">
                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <dt className="text-base font-medium text-slate-900">Загалом</dt>
                                    <dd className="text-xl font-bold text-slate-900">{(subtotal / 100).toLocaleString('uk-UA')} ₴</dd>
                                </div>
                            </dl>

                            <Link
                                href="/checkout"
                                className="w-full flex items-center justify-center rounded-full border border-transparent bg-slate-900 px-6 py-4 text-base font-medium text-white shadow-sm hover:bg-slate-800 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                            >
                                Оформити замовлення
                            </Link>

                            <div className="mt-6 text-center text-sm text-slate-500 flex items-center justify-center gap-2">
                                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                                Безпечна оплата гарантована
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-200">
                        <svg className="mx-auto h-16 w-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        <h3 className="mt-4 text-lg font-medium text-slate-900">Кошик порожній</h3>
                        <p className="mt-2 text-sm text-slate-500 mb-8 max-w-sm mx-auto">Додайте свої найкращі спогади до кошика, щоб зберегти їх назавжди.</p>
                        <Link
                            href="/catalog"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-rose-600 hover:bg-rose-700 transition-colors"
                        >
                            Перейти до каталогу
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
