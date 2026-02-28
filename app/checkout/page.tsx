"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function CheckoutPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        deliveryMethod: 'nova_poshta',
        cityRef: '', // would be populated by Nova Poshta API search
        warehouseRef: '', // would be populated by Nova Poshta API search
        addressLabel: '' // custom address for courier
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mock cart items for MVP front-end demo
    const subtotal = 179800; // 1798 UAH
    const deliveryCost = 0; // standard

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // In a real app, gather cart items from context/zustand
            const mockItems = [
                { productId: "e1", name: "Полароїдні фотокартки (24 шт)", price: 49900, quantity: 1, customization: { format: "Polaroid" } },
                { productId: "e2", name: "Фотокнига Classic", price: 129900, quantity: 1, customization: { cover: "Hard", pages: 24 } }
            ];

            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName: `${formData.firstName} ${formData.lastName}`.trim(),
                    customerEmail: formData.email,
                    customerPhone: formData.phone,
                    deliveryMethod: formData.deliveryMethod,
                    deliveryCityRef: formData.cityRef || '00000000-0000-0000-0000-000000000000', // Mock UUIDs for UI demo
                    deliveryWarehouseRef: formData.warehouseRef || '00000000-0000-0000-0000-000000000000',
                    deliveryAddressLabel: formData.addressLabel,
                    items: mockItems,
                    totalAmount: subtotal + deliveryCost
                })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Checkout failed');

            // Redirect to Monobank payment page
            if (data.pageUrl) {
                window.location.href = data.pageUrl;
            }

        } catch (error) {
            console.error(error);
            alert('Помилка при створенні замовлення. Будь ласка, спробуйте пізніше.');
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-slate-50 min-h-[calc(100vh-64px)] py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="mb-8">
                    <Link href="/cart" className="text-sm font-medium text-slate-500 hover:text-slate-900 inline-flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        Повернутись до кошика
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 mt-4">Оформлення замовлення</h1>
                </div>

                <div className="lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16 lg:items-start">

                    {/* Form */}
                    <div className="lg:col-span-7">
                        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-10 focus-within:ring-2 focus-within:ring-rose-500 focus-within:ring-offset-2 transition-all">

                            {/* Contact Info */}
                            <section>
                                <h2 className="text-xl font-medium text-slate-900 mb-6 flex items-center gap-2">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold">1</span>
                                    Контактні дані
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-slate-700">Ім'я</label>
                                        <input type="text" id="firstName" name="firstName" required
                                            className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm py-3 px-4 bg-slate-50"
                                            value={formData.firstName} onChange={handleChange} placeholder="Іван" />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-slate-700">Прізвище</label>
                                        <input type="text" id="lastName" name="lastName" required
                                            className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm py-3 px-4 bg-slate-50"
                                            value={formData.lastName} onChange={handleChange} placeholder="Іванов" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="email" className="block text-sm font-medium text-slate-700">Електронна пошта (сюди прийде фіскальний чек та деталі)</label>
                                        <input type="email" id="email" name="email" required
                                            className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm py-3 px-4 bg-slate-50"
                                            value={formData.email} onChange={handleChange} placeholder="ivan@example.com" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Номер телефону</label>
                                        <input type="tel" id="phone" name="phone" required
                                            className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm py-3 px-4 bg-slate-50"
                                            value={formData.phone} onChange={handleChange} placeholder="+380 50 123 45 67" />
                                    </div>
                                </div>
                            </section>

                            {/* Delivery Info */}
                            <section className="pt-8 border-t border-slate-100">
                                <h2 className="text-xl font-medium text-slate-900 mb-6 flex items-center gap-2">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold">2</span>
                                    Доставка
                                </h2>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 bg-slate-50 p-4 border border-slate-200 rounded-xl cursor-not-allowed opacity-60">
                                        <input type="radio" name="deliveryMethod" value="courier" className="text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-not-allowed" disabled />
                                        <span className="text-sm font-medium text-slate-700">Кур'єр Нової Пошти (тимчасово недоступно)</span>
                                    </div>

                                    <div className="flex items-center gap-4 bg-white p-4 border-2 border-slate-900 rounded-xl">
                                        <input type="radio" name="deliveryMethod" value="nova_poshta" className="text-slate-900 focus:ring-slate-900 w-4 h-4" defaultChecked />
                                        <div>
                                            <span className="block text-sm font-medium text-slate-900">У відділення Нової Пошти</span>
                                            <span className="block text-xs text-slate-500 mt-1">Доставка займає 1-3 робочих дні</span>
                                        </div>
                                    </div>

                                    {/* NP Locators Demo */}
                                    <div className="grid grid-cols-1 gap-4 mt-6">
                                        <div>
                                            <label htmlFor="city" className="block text-sm font-medium text-slate-700">Місто</label>
                                            <input type="text" id="city" className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm py-3 px-4 bg-slate-50" placeholder="Почніть вводити назву міста..." />
                                        </div>
                                        <div>
                                            <label htmlFor="warehouse" className="block text-sm font-medium text-slate-700">Відділення / Поштомат</label>
                                            <input type="text" id="warehouse" className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm py-3 px-4 bg-slate-50" placeholder="Оберіть зручне відділення..." />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full flex items-center justify-center rounded-full border border-transparent bg-slate-900 px-6 py-4 text-base font-medium text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Обробка...
                                    </span>
                                ) : (
                                    <>Оплатити {(subtotal / 100).toLocaleString('uk-UA')} ₴ через Monobank</>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Sidebar Summary */}
                    <div className="mt-10 lg:mt-0 lg:col-span-5">
                        <div className="bg-slate-100 rounded-2xl p-6 sm:p-8 border border-slate-200 lg:sticky lg:top-24">
                            <h2 className="text-lg font-medium text-slate-900 mb-6">Кошик</h2>

                            <ul className="divide-y divide-slate-200/60 border-b border-slate-200/60 pb-6 mb-6 text-sm text-slate-600">
                                <li className="py-4 flex items-start gap-4">
                                    <div className="w-16 h-16 bg-white rounded-lg border border-slate-200 shrink-0"></div>
                                    <div className="flex-grow">
                                        <p className="font-medium text-slate-900">Полароїдні фотокартки (24 шт)</p>
                                        <p className="text-xs text-slate-500 mt-1">К-ть: 1</p>
                                    </div>
                                    <span className="font-medium text-slate-900 shrink-0">499 ₴</span>
                                </li>
                                <li className="py-4 flex items-start gap-4">
                                    <div className="w-16 h-16 bg-white rounded-lg border border-slate-200 shrink-0"></div>
                                    <div className="flex-grow">
                                        <p className="font-medium text-slate-900">Фотокнига Classic</p>
                                        <p className="text-xs text-slate-500 mt-1">К-ть: 1</p>
                                    </div>
                                    <span className="font-medium text-slate-900 shrink-0">1 299 ₴</span>
                                </li>
                            </ul>

                            <dl className="space-y-3 text-sm text-slate-600 mb-6 border-b border-slate-200 pb-6">
                                <div className="flex items-center justify-between">
                                    <dt>Сума товарів</dt>
                                    <dd className="font-medium text-slate-900">1 798 ₴</dd>
                                </div>
                                <div className="flex items-center justify-between">
                                    <dt>Доставка (Нова Пошта)</dt>
                                    <dd className="font-medium text-slate-900">За тарифами перевізника</dd>
                                </div>
                            </dl>

                            <div className="flex items-center justify-between">
                                <p className="text-lg font-bold text-slate-900">Загалом до оплати</p>
                                <p className="text-xl font-bold text-slate-900">1 798 ₴</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
