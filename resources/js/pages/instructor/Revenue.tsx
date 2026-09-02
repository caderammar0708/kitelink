import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    ArrowDownRight,
    ArrowUpRight,
    Building2,
    CheckCircle2,
    CreditCard,
    DollarSign,
    Download,
    Eye,
    FileText,
    HelpCircle,
    Info,
    Printer,
    Save,
    TrendingUp,
    Wallet,
    Wind,
    X,
} from 'lucide-react';
import { useState } from 'react';

interface Transaction {
    id: number;
    date: string;
    client: string;
    amount: number;
    lesson_type?: string;
    status: string;
}

interface RevenueProps {
    totalEarned?: number;
    thisMonth?: number;
    pendingPayout?: number;
    transactions?: Transaction[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Instructor Dashboard',
        href: '/instructor/dashboard',
    },
    {
        title: 'Revenue & Earnings',
        href: '/instructor/revenue',
    },
];

export default function Revenue({
    totalEarned = 0,
    thisMonth = 0,
    pendingPayout = 0,
    transactions = [],
}: RevenueProps) {
    const [activePayoutMethod, setActivePayoutMethod] = useState<'bank' | 'paypal'>('bank');
    const [bankDetails, setBankDetails] = useState({
        accountHolder: 'Alex Henderson',
        bankName: 'Commercial Bank of Ceylon',
        accountNumber: '•••• •••• •••• 4892',
        swift: 'CCEYLKJA',
    });
    const [paypalEmail, setPaypalEmail] = useState('alex.kitesurf@example.com');
    const [payoutSaved, setPayoutSaved] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Transaction | null>(null);

    const handleSavePayout = (e: React.FormEvent) => {
        e.preventDefault();
        setPayoutSaved(true);
        setTimeout(() => setPayoutSaved(false), 3000);
    };

    const handlePrintInvoice = () => {
        window.print();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Revenue & Earnings - KiteLink" />

            <div className="relative min-h-full space-y-6 p-4 text-slate-100 selection:bg-[#3b82f6]/30 selection:text-white sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="flex items-center gap-2.5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                            <DollarSign className="h-7 w-7 text-emerald-400" />
                            Revenue &amp; Payouts
                        </h1>
                        <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                            Track total earnings, automatic payout schedules, and download invoices for completed lessons
                        </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/30 px-4 py-1.5 text-xs font-semibold text-emerald-300">
                        <CheckCircle2 className="h-4 w-4" />
                        Next Payout: Friday, 15th
                    </div>
                </div>

                {/* 3 Summary Glass Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
                    {/* Total Earned */}
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-xl backdrop-blur-xl">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Total Lifetime Earned</span>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-400/15 text-emerald-400">
                                <DollarSign className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-3xl font-extrabold text-white sm:text-4xl">${totalEarned.toLocaleString()}</span>
                            <p className="mt-1 text-xs text-slate-400">Across all completed student lessons</p>
                        </div>
                    </div>

                    {/* Pending Payout */}
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-xl backdrop-blur-xl">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Pending Escrow Payout</span>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#3b82f6]/30 bg-[#3b82f6]/15 text-[#5bb4ff]">
                                <Wallet className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-3xl font-extrabold text-[#8acbff] sm:text-4xl">${pendingPayout.toLocaleString()}</span>
                            <p className="mt-1 text-xs text-slate-400">Releases upon lesson completion</p>
                        </div>
                    </div>

                    {/* This Month */}
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-xl backdrop-blur-xl">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">This Month Earnings</span>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/15 text-amber-400">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-3xl font-extrabold text-white sm:text-4xl">${thisMonth.toLocaleString()}</span>
                            <p className="mt-1 text-xs text-emerald-400">Current calendar cycle</p>
                        </div>
                    </div>
                </div>

                {/* 2-Column Section: Transactions Table & Payout Settings */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Transactions History Table (8 cols) */}
                    <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.05] p-5 shadow-2xl backdrop-blur-xl sm:p-6 lg:col-span-8">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div>
                                <h2 className="flex items-center gap-2 text-base font-bold text-white">
                                    <FileText className="h-5 w-5 text-[#5bb4ff]" />
                                    Transaction &amp; Invoice History
                                </h2>
                                <p className="mt-0.5 text-xs text-slate-400">
                                    Detailed record of completed student lessons and downloadable VAT invoices
                                </p>
                            </div>
                        </div>

                        {transactions.length === 0 ? (
                            <div className="py-12 text-center text-xs text-slate-400">
                                <FileText className="mx-auto mb-2 h-8 w-8 text-slate-600" />
                                No completed transactions recorded yet.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-white/10 font-semibold tracking-wider text-slate-400 uppercase">
                                            <th className="px-3 pb-3">Invoice #</th>
                                            <th className="px-3 pb-3">Date</th>
                                            <th className="px-3 pb-3">Student</th>
                                            <th className="px-3 pb-3">Type</th>
                                            <th className="px-3 pb-3">Amount</th>
                                            <th className="px-3 pb-3 text-right">Invoice</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {transactions.map((tx) => (
                                            <tr key={tx.id} className="transition hover:bg-white/[0.04]">
                                                <td className="px-3 py-3 font-mono text-slate-400">
                                                    KL-INV-{String(tx.id).padStart(5, '0')}
                                                </td>
                                                <td className="px-3 py-3 text-slate-300">{tx.date}</td>
                                                <td className="px-3 py-3 font-semibold text-white">{tx.client}</td>
                                                <td className="px-3 py-3 text-slate-300">{tx.lesson_type || 'Private Lesson'}</td>
                                                <td className="px-3 py-3 font-bold text-emerald-400">${tx.amount}</td>
                                                <td className="px-3 py-3 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedInvoice(tx)}
                                                        className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/[0.06] px-2.5 py-1 text-xs text-slate-200 transition hover:bg-white/15"
                                                    >
                                                        <Eye className="h-3.5 w-3.5 text-[#5bb4ff]" />
                                                        View Invoice
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Payout Method Settings (4 cols) */}
                    <div className="space-y-6 lg:col-span-4">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 shadow-2xl backdrop-blur-xl sm:p-6">
                            <h2 className="flex items-center gap-2 text-base font-bold text-white">
                                <CreditCard className="h-5 w-5 text-[#5bb4ff]" />
                                Payout Method Settings
                            </h2>
                            <p className="mt-1 text-xs text-slate-400">
                                Choose where your lesson earnings are deposited automatically
                            </p>

                            {payoutSaved && (
                                <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-950/60 p-3 text-xs text-emerald-300">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                    Payout preferences saved!
                                </div>
                            )}

                            {/* Method Selector */}
                            <div className="mt-4 grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setActivePayoutMethod('bank')}
                                    className={`flex items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-bold transition ${
                                        activePayoutMethod === 'bank'
                                            ? 'border-[#5bb4ff]/60 bg-[#1f6eff]/20 text-white'
                                            : 'border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/[0.06]'
                                    }`}
                                >
                                    <Building2 className="h-4 w-4 text-[#5bb4ff]" />
                                    Bank Transfer
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActivePayoutMethod('paypal')}
                                    className={`flex items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-bold transition ${
                                        activePayoutMethod === 'paypal'
                                            ? 'border-[#38bdf8]/60 bg-[#38bdf8]/20 text-white'
                                            : 'border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/[0.06]'
                                    }`}
                                >
                                    <Wallet className="h-4 w-4 text-[#38bdf8]" />
                                    PayPal
                                </button>
                            </div>

                            <form onSubmit={handleSavePayout} className="mt-4 space-y-3">
                                {activePayoutMethod === 'bank' ? (
                                    <>
                                        <div className="space-y-1">
                                            <label className="block text-[11px] font-semibold text-slate-300 uppercase">
                                                Account Holder Name
                                            </label>
                                            <input
                                                type="text"
                                                value={bankDetails.accountHolder}
                                                onChange={(e) => setBankDetails({ ...bankDetails, accountHolder: e.target.value })}
                                                className="w-full rounded-xl border border-white/15 bg-slate-950/40 px-3 py-2 text-xs text-white focus:border-[#3b82f6] focus:outline-none"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="block text-[11px] font-semibold text-slate-300 uppercase">
                                                Bank Name
                                            </label>
                                            <input
                                                type="text"
                                                value={bankDetails.bankName}
                                                onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                                                className="w-full rounded-xl border border-white/15 bg-slate-950/40 px-3 py-2 text-xs text-white focus:border-[#3b82f6] focus:outline-none"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="block text-[11px] font-semibold text-slate-300 uppercase">
                                                Account Number / IBAN
                                            </label>
                                            <input
                                                type="text"
                                                value={bankDetails.accountNumber}
                                                onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                                                className="w-full rounded-xl border border-white/15 bg-slate-950/40 px-3 py-2 text-xs text-white focus:border-[#3b82f6] focus:outline-none"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="block text-[11px] font-semibold text-slate-300 uppercase">
                                                SWIFT / BIC Code
                                            </label>
                                            <input
                                                type="text"
                                                value={bankDetails.swift}
                                                onChange={(e) => setBankDetails({ ...bankDetails, swift: e.target.value })}
                                                className="w-full rounded-xl border border-white/15 bg-slate-950/40 px-3 py-2 text-xs text-white focus:border-[#3b82f6] focus:outline-none"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-1">
                                        <label className="block text-[11px] font-semibold text-slate-300 uppercase">
                                            PayPal Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={paypalEmail}
                                            onChange={(e) => setPaypalEmail(e.target.value)}
                                            className="w-full rounded-xl border border-white/15 bg-slate-950/40 px-3 py-2 text-xs text-white focus:border-[#3b82f6] focus:outline-none"
                                        />
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4ba9ff] to-[#1f6eff] px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:scale-[1.01]"
                                >
                                    <Save className="h-4 w-4" />
                                    Save Payout Method
                                </button>
                            </form>
                        </div>

                        {/* Payout Security Notice */}
                        <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4 text-xs text-slate-400">
                            <div className="flex items-start gap-2">
                                <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#5bb4ff]" />
                                <div>
                                    <strong className="text-slate-200">0% Platform Commission</strong>
                                    <p className="mt-0.5 text-[11px]">
                                        KiteLink pays instructors 100% of your listed hourly rate. Student payments are processed securely via Stripe Escrow.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Invoice Modal */}
            {selectedInvoice && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
                    <div className="relative w-full max-w-lg rounded-2xl border border-white/20 bg-[#070b12] p-6 shadow-2xl text-slate-100 sm:p-8">
                        <button
                            type="button"
                            onClick={() => setSelectedInvoice(null)}
                            className="absolute top-4 right-4 rounded-lg p-1 text-slate-400 hover:text-white"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div className="flex items-center gap-2">
                                <Wind className="h-6 w-6 text-[#5bb4ff]" />
                                <span className="text-lg font-bold text-white">KiteLink Receipt</span>
                            </div>
                            <span className="font-mono text-xs text-slate-400">
                                #KL-INV-{String(selectedInvoice.id).padStart(5, '0')}
                            </span>
                        </div>

                        <div className="my-6 space-y-4 text-xs">
                            <div className="flex justify-between text-slate-300">
                                <span>Date:</span>
                                <span className="font-semibold text-white">{selectedInvoice.date}</span>
                            </div>
                            <div className="flex justify-between text-slate-300">
                                <span>Student / Client:</span>
                                <span className="font-semibold text-white">{selectedInvoice.client}</span>
                            </div>
                            <div className="flex justify-between text-slate-300">
                                <span>Session Description:</span>
                                <span className="font-semibold text-white">{selectedInvoice.lesson_type || 'Private Coaching'}</span>
                            </div>
                            <div className="flex justify-between border-t border-white/10 pt-3 text-sm">
                                <span className="font-bold text-white">Total Amount Paid:</span>
                                <span className="font-extrabold text-emerald-400">${selectedInvoice.amount} USD</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
                            <button
                                type="button"
                                onClick={handlePrintInvoice}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/[0.08] px-4 py-2 text-xs font-semibold text-white hover:bg-white/15"
                            >
                                <Printer className="h-4 w-4" />
                                Print / Save PDF
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedInvoice(null)}
                                className="rounded-xl bg-[#1f6eff] px-4 py-2 text-xs font-bold text-white hover:bg-[#3b82f6]"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
