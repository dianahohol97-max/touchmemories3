import { supabaseAdmin } from '@/lib/supabase';
import Link from 'next/link';

// Simple functional component to fetch and display products
export default async function CatalogPage() {
    // Fetch active products
    const { data: products, error } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching products:', error);
    }

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Page Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                        Каталог продукції
                    </h1>
                    <p className="mt-4 text-lg text-slate-500">
                        Оберіть формат, який найкраще підійде для ваших спогадів
                    </p>
                </div>

                {/* Product Grid */}
                {products && products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <Link
                                href={`/products/${product.slug}`}
                                key={product.id}
                                className="group flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100"
                            >
                                {/* Image Container */}
                                <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden">
                                    {/* Decorative background until we have real images uploaded */}
                                    <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.2)_50%,transparent_75%,transparent_100%)] [background-size:20px_20px]"></div>

                                    {/* If we had images: */}
                                    {/* {product.images?.[0] && (
                    <Image 
                      src={product.images[0]} 
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )} */}

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors duration-300"></div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col flex-grow">
                                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-1">
                                        {product.name}
                                    </h3>
                                    <p className="mt-2 text-sm text-slate-500 line-clamp-2 flex-grow">
                                        {product.description}
                                    </p>
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="text-lg font-bold text-slate-900">
                                            {(product.base_price_uah / 100).toLocaleString('uk-UA')} ₴
                                        </span>
                                        <span className="text-sm font-medium text-rose-600 group-hover:text-rose-700 bg-rose-50 px-3 py-1 rounded-full group-hover:bg-rose-100 transition-colors">
                                            Детальніше
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-200">
                        <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                        </svg>
                        <h3 className="mt-4 text-sm font-semibold text-slate-900">Немає товарів</h3>
                        <p className="mt-1 text-sm text-slate-500">Ми ще не додали товари в каталог. Поверніться згодом.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
