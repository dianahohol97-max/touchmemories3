import { supabaseAdmin } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';

// Next.js App Router syntax for dynamic params
export default async function ProductPage({ params }: { params: { slug: string } }) {
    // Await the entire params object before destructuring its properties
    const { slug } = await params;

    // Fetch product by slug
    const { data: product, error } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !product || !product.is_active) {
        notFound();
    }

    const priceFormatted = (product.base_price_uah / 100).toLocaleString('uk-UA');

    return (
        <div className="bg-white min-h-screen">
            {/* Breadcrumbs */}
            <nav className="border-b border-slate-100 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <ol className="flex items-center space-x-2 text-sm text-slate-500">
                        <li><Link href="/" className="hover:text-slate-900 transition-colors">Головна</Link></li>
                        <li><span className="mx-2">/</span></li>
                        <li><Link href="/catalog" className="hover:text-slate-900 transition-colors">Каталог</Link></li>
                        <li><span className="mx-2">/</span></li>
                        <li className="text-slate-900 font-medium" aria-current="page">{product.name}</li>
                    </ol>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">

                    {/* Image Gallery (Placeholder for now) */}
                    <div className="flex flex-col gap-4">
                        <div className="aspect-[4/5] bg-slate-100 rounded-3xl overflow-hidden relative border border-slate-100">
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]"></div>
                            <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                        {/* Thumbnails placeholder */}
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-square bg-slate-100 rounded-xl cursor-pointer hover:ring-2 hover:ring-rose-500 hover:ring-offset-2 transition-all"></div>
                            ))}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="mt-10 lg:mt-0 flex flex-col">
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">{product.name}</h1>

                        <div className="mt-4 flex items-center gap-4">
                            <span className="text-3xl font-bold text-slate-900">{priceFormatted} ₴</span>
                            {/* Optional stock badge */}
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                В наявності
                            </span>
                        </div>

                        <div className="mt-8 relative">
                            <h3 className="sr-only">Опис това principal</h3>
                            <div className="prose prose-sm sm:prose-base prose-slate text-slate-600 max-w-none space-y-4 whitespace-pre-line">
                                {product.description || 'Опис товару незабаром з\'явиться.'}
                            </div>
                        </div>

                        {/* Customization / Options Demo */}
                        <div className="mt-10 border-t border-slate-200 pt-8">
                            <h3 className="text-lg font-medium text-slate-900 mb-4">Налаштування замовлення</h3>

                            <div className="space-y-6">
                                {/* Example option */}
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Формат фотокарток</label>
                                    <div className="mt-2 grid grid-cols-3 gap-3">
                                        <button className="border-2 border-rose-500 bg-rose-50 text-rose-700 rounded-xl py-3 text-sm font-medium hover:bg-rose-50 transition-colors">
                                            Polaroid<br /><span className="text-xs font-normal">10x12 см</span>
                                        </button>
                                        <button className="border border-slate-200 text-slate-600 rounded-xl py-3 text-sm font-medium hover:border-slate-300 hover:bg-slate-50 transition-colors">
                                            Square<br /><span className="text-xs font-normal">10x10 см</span>
                                        </button>
                                        <button className="border border-slate-200 text-slate-600 rounded-xl py-3 text-sm font-medium hover:border-slate-300 hover:bg-slate-50 transition-colors">
                                            Mini<br /><span className="text-xs font-normal">6x9 см</span>
                                        </button>
                                    </div>
                                </div>

                                {/* File Upload Button (UI Only) */}
                                <div>
                                    <label className="text-sm font-medium text-slate-700 flex items-center justify-between">
                                        Завантажте фотографії
                                        <span className="text-slate-400 text-xs font-normal">Вже вибрано: 0</span>
                                    </label>
                                    <button className="mt-2 w-full border-2 border-dashed border-slate-300 rounded-xl py-8 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-rose-300 hover:text-rose-500 transition-all group">
                                        <svg className="w-8 h-8 mb-2 text-slate-400 group-hover:text-rose-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span className="font-medium">Натисніть для вибору файлів</span>
                                        <span className="text-xs mt-1 opacity-75">або перетягніть їх сюди (JPG, HEIC, PNG)</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-10 flex gap-4 mt-auto pt-8">
                            <button
                                type="button"
                                className="flex-1 bg-slate-900 border border-transparent rounded-full py-4 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-slate-800 hover:shadow-lg transition-all active:scale-95"
                            >
                                Додати в кошик
                            </button>
                            <button
                                type="button"
                                className="p-4 rounded-full border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-all"
                                title="Додати до улюбленого"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                        </div>

                        {/* Value Props Box */}
                        <div className="mt-8 bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
                                Відправка протягом 1-3 робочих днів
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Преміальний японський фотопапір
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Безпечна онлайн оплата (Monobank)
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
