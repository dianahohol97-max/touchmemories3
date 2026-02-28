import { supabaseAdmin } from '@/lib/supabase';

export default async function AdminDashboard() {
    // Mock data since tables are empty
    // Real implementation: count(*) from orders where status='paid', etc.

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-8">Дашборд</h1>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                {[
                    { label: "Нові замовлення (Сьогодні)", value: "0", sub: "Очікують відправки", trend: "+0%" },
                    { label: "Зароблено (Місяць)", value: "0 ₴", sub: "Оплачені замовлення", trend: "+0%" },
                    { label: "Видано чеків ПРРО", value: "0", sub: "Checkbox", trend: "success" },
                    { label: "Товарів в каталозі", value: "0", sub: "Активні", trend: "" }
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
                        <h3 className="text-sm font-medium text-slate-500 mb-2">{stat.label}</h3>
                        <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                        <div className="mt-auto flex justify-between items-center">
                            <span className="text-xs text-slate-400">{stat.sub}</span>
                            {stat.trend && (
                                <span className={`text-xs font-medium ${stat.trend === 'success' ? 'text-emerald-500' : 'text-slate-900'}`}>{stat.trend}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-slate-900">Останні замовлення</h2>
                    <button className="text-sm text-rose-600 hover:text-rose-700 font-medium">Переглянути всі</button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID Замовлення</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Клієнт</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Сума</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Статус</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Дата</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {/* Empty state simulation */}
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">
                                    <svg className="mx-auto h-12 w-12 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                    Замовлень поки немає.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
