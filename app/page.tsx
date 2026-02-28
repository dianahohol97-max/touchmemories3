import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Abstract Background - Elegant gradient instead of image for now */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 -z-10" />
        <div className="absolute inset-0 opacity-20 -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-8 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-sm">
            Ваші спогади.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-200 to-rose-400">
              Втілені в реальність.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Преміальний друк фотокарток, магнітів та фотокниг.
            Збережіть найкращі моменти життя з найвищою якістю.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/catalog"
              className="px-8 py-4 bg-white text-slate-900 rounded-full font-medium hover:bg-slate-50 transition-all hover:scale-105 hover:shadow-lg hover:shadow-white/20 active:scale-95 w-full sm:w-auto"
            >
              Переглянути каталог
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 bg-white/10 text-white backdrop-blur-sm border border-white/20 rounded-full font-medium hover:bg-white/20 transition-all active:scale-95 w-full sm:w-auto"
            >
              Дізнатись більше
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white py-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="p-4 space-y-2">
              <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900">Преміальна якість</h3>
              <p className="text-sm text-slate-500">Використовуємо лише професійний фотопапір Fuji</p>
            </div>
            <div className="p-4 space-y-2">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900">Швидка доставка</h3>
              <p className="text-sm text-slate-500">Відправка Новою Поштою по всій Україні за 1-3 дні</p>
            </div>
            <div className="p-4 space-y-2">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900">Захищені платежі</h3>
              <p className="text-sm text-slate-500">Офіційна оплата через Monobank з видачею фіскального чека</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories/Products */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Популярні товари</h2>
            <p className="mt-4 text-lg text-slate-500">Оберіть ідеальний формат для ваших спогадів</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Placeholder Product Cards (will be dynamic from DB later) */}
            <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
              <div className="aspect-[4/3] bg-slate-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                {/* Fallback pattern since we don't have images yet */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="absolute bottom-4 left-4 z-20">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur text-xs font-semibold rounded-full text-slate-900">Хіт продажу</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-rose-600 transition-colors">Полароїдні фотокартки</h3>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2">Комплект з 24 фотокарток у стилі Polaroid. Ідеальний для прикрашання вашої кімнати.</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-slate-900">від 499 ₴</span>
                  <Link href="/catalog" className="text-sm font-medium text-rose-600 hover:text-rose-700">Замовити &rarr;</Link>
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
              <div className="aspect-[4/3] bg-slate-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-rose-600 transition-colors">Фотокнига Classic</h3>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2">Тверда обкладинка, преміум папір. Збережіть цілу історію в одній книзі.</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-slate-900">від 1299 ₴</span>
                  <Link href="/catalog" className="text-sm font-medium text-rose-600 hover:text-rose-700">Замовити &rarr;</Link>
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
              <div className="aspect-[4/3] bg-slate-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-rose-600 transition-colors">Фотомагніти</h3>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2">Набір вінілових магнітів на холодильник. Ваш настрій щодня.</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-slate-900">від 399 ₴</span>
                  <Link href="/catalog" className="text-sm font-medium text-rose-600 hover:text-rose-700">Замовити &rarr;</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center px-6 py-3 border border-slate-300 shadow-sm text-base font-medium rounded-full text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 transition-all hover:border-slate-400"
            >
              Переглянути всі товари
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
