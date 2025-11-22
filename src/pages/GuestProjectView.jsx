// src/pages/GuestProjectView.jsx (FULL DATA)

// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import api from '../api';
// import { FiArrowLeft, FiDownload, FiCalendar, FiTag, FiCreditCard } from 'react-icons/fi';

// const CURRENCIES = ['INR', 'USD', 'AED', 'CAD', 'AUD'];
// const SYMBOLS = { INR: '₹', USD: '$', AED: 'د.إ', CAD: 'C$', AUD: 'A$' };
// const RATES = { INR: 1, USD: 88.5, AED: 24.1, CAD: 63.8, AUD: 58.4 };

// const GuestProjectView = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [project, setProject] = useState(null);
//   const [incomes, setIncomes] = useState([]);
//   const [expenses, setExpenses] = useState([]);
//   const [summary, setSummary] = useState({ totalIncomeINR: 0, totalExpenseINR: 0, balanceINR: 0 });
//   const [currency, setCurrency] = useState('INR');
//   const [loading, setLoading] = useState(true);

//   const convert = (amount, from) => (amount * RATES[from] / RATES[currency]).toFixed(2);

//   useEffect(() => {
//   const load = async () => {
//     try {
//       const [projRes, incRes, expRes, sumRes] = await Promise.all([
//         api.get(`/projects/${id}`),
//         api.get(`/finance/guest/incomes?project=${id}`),   // GUEST ROUTE
//         api.get(`/finance/guest/expenses?project=${id}`), // GUEST ROUTE
//         api.get(`/finance/summary?project=${id}`),        // This already works
//       ]);

//       setProject(projRes.data.project || projRes.data);
//       setIncomes(incRes.data.incomes || []);
//       setExpenses(expRes.data.expenses || []);
//       setSummary(sumRes.data.summary || { totalIncomeINR: 0, totalExpenseINR: 0, balanceINR: 0 });
//     } catch (err) {
//       console.error("Guest load error:", err);
//       alert("Failed to load project data");
//       navigate('/guestDashboard');
//     } finally {
//       setLoading(false);
//     }
//   };

//   load();
// }, [id, navigate]);

//   const downloadExcel = async () => {
//     try {
//       const res = await api.get(`/finance/download?project=${id}`, { responseType: 'blob' });
//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `${project?.name || "Project"}_Report.xlsx`;
//       a.click();
//     } catch {
//       alert("Download failed");
//     }
//   };

//   if (loading) return <div className="min-h-screen flex items-center justify-center text-4xl">Loading...</div>;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100">
//       {/* Header */}
//       <header className="fixed top-0 w-full bg-gradient-to-r from-indigo-700 to-purple-800 text-white shadow-2xl z-50">
//         <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
//           <button onClick={() => navigate('/guestDashboard')} className="flex items-center gap-3 hover:bg-white/20 px-6 py-3 rounded-xl">
//             Back
//           </button>
//           <h1 className="text-4xl font-black">{project?.name} - Guest View</h1>
//           <button onClick={downloadExcel} className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-xl font-bold flex items-center gap-3">
//             Download Excel
//           </button>
//         </div>
//       </header>

//       <div className="pt-32 px-6 pb-20 max-w-7xl mx-auto">
//         {/* Currency */}
//         <div className="text-center mb-12">
//           <select value={currency} onChange={e => setCurrency(e.target.value)} className="px-12 py-5 text-3xl font-bold rounded-2xl border-4 border-indigo-500">
//             {CURRENCIES.map(c => <option key={c} value={c}>{c} {SYMBOLS[c]}</option>)}
//           </select>
//         </div>

//         {/* Summary */}
//         <div className="grid md:grid-cols-3 gap-8 mb-16">
//           <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white p-10 rounded-3xl text-center shadow-2xl">
//             <p className="text-2xl">Total Income</p>
//             <p className="text-6xl font-black mt-4">{SYMBOLS[currency]}{convert(summary.totalIncomeINR, 'INR')}</p>
//           </div>
//           <div className="bg-gradient-to-br from-rose-500 to-red-600 text-white p-10 rounded-3xl text-center shadow-2xl">
//             <p className="text-2xl">Total Expense</p>
//             <p className="text-6xl font-black mt-4">{SYMBOLS[currency]}{convert(summary.totalExpenseINR, 'INR')}</p>
//           </div>
//           <div className={`p-10 rounded-3xl text-white text-center shadow-2xl ${summary.balanceINR >= 0 ? 'bg-gradient-to-br from-blue-600 to-cyan-700' : 'bg-orange-600'}`}>
//             <p className="text-2xl">Balance</p>
//             <p className="text-6xl font-black mt-4">{SYMBOLS[currency]}{convert(Math.abs(summary.balanceINR), 'INR')}</p>
//           </div>
//         </div>

//         {/* Transactions */}
//         <div className="grid lg:grid-cols-2 gap-12">
//           <div className="bg-white rounded-3xl shadow-2xl">
//             <div className="bg-gradient-to-r from-emerald-600 to-green-700 text-white p-8 rounded-t-3xl">
//               <h2 className="text-4xl font-black">Income ({incomes.length})</h2>
//             </div>
//             <div className="p-8 space-y-6">
//               {incomes.map(inc => (
//                 <div key={inc._id} className="bg-emerald-50 p-8 rounded-2xl border-2 border-emerald-300">
//                   <div className="flex justify-between">
//                     <div>
//                       <h3 className="text-2xl font-black">{inc.title}</h3>
//                       <p className="text-gray-600 flex items-center gap-2 mt-2">
//                         <FiCalendar /> {new Date(inc.date).toLocaleDateString()}
//                       </p>
//                       <p className="mt-3"><strong>Category:</strong> {inc.category}</p>
//                       <p><strong>Method:</strong> {inc.paymentMethod}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-4xl font-black text-emerald-600">
//                         {SYMBOLS[currency]}{convert(inc.amount, inc.currency)}
//                       </p>
//                       <p className="text-sm text-gray-500">{inc.currency} {inc.amount}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="bg-white rounded-3xl shadow-2xl">
//             <div className="bg-gradient-to-r from-rose-600 to-red-700 text-white p-8 rounded-t-3xl">
//               <h2 className="text-4xl font-black">Expense ({expenses.length})</h2>
//             </div>
//             <div className="p-8 space-y-6">
//               {expenses.map(exp => (
//                 <div key={exp._id} className="bg-rose-50 p-8 rounded-2xl border-2 border-rose-300">
//                   <div className="flex justify-between">
//                     <div>
//                       <h3 className="text-2xl font-black">{exp.title}</h3>
//                       <p className="text-gray-600 flex items-center gap-2 mt-2">
//                         <FiCalendar /> {new Date(exp.date).toLocaleDateString()}
//                       </p>
//                       <p className="mt-3"><strong>Category:</strong> {exp.category}</p>
//                       <p><strong>Method:</strong> {exp.paymentMethod}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-4xl font-black text-rose-600">
//                         {SYMBOLS[currency]}{convert(exp.amount, exp.currency)}
//                       </p>
//                       <p className="text-sm text-gray-500">{exp.currency} {exp.amount}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GuestProjectView;

//=======================================

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { FiCalendar, FiTag, FiCreditCard } from "react-icons/fi";

const GuestProjectView = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [projRes, incRes, expRes] = await Promise.all([
                    api.get(`/projects/${id}`),
                    api.get(`/finance/guest/incomes?project=${id}`),
                    api.get(`/finance/guest/expenses?project=${id}`),
                ]);

                setProject(projRes.data.project || projRes.data);
                setIncomes(incRes.data.incomes || []);
                setExpenses(expRes.data.expenses || []);
            } catch (err) {
                console.error("Guest load error:", err);
                alert("Failed to load project data");
                navigate("/guestDashboard");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id, navigate]);

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center text-4xl">
                Loading...
            </div>
        );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-indigo-200">
            {/* HEADER */}
            <header className="fixed top-0 w-full bg-gradient-to-r from-indigo-700 to-purple-800 text-white shadow-2xl z-50">
                <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">

                    {/* <button
                        onClick={() => navigate("/guestDashboard")}
                        className="flex items-center gap-3 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
                    >
                        Back
                    </button> */}


                    <button
                        onClick={() => navigate("/guestDashboard")}
                        className="cursor-pointer flex items-center gap-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:opacity-90 transition"
                    >
                        Back
                    </button>

                    {/* <button
  onClick={() => navigate("/guestDashboard")}
  className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition"
>
  Back
</button> */}

                    <h1 className="text-4xl font-black tracking-wide">
                        {project?.name} – Guest View
                    </h1>
                    <div></div>
                </div>
            </header>

            <div className="pt-32 px-6 pb-20 max-w-7xl mx-auto">
                {/* GRID */}
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* ========================= INCOMES ============================= */}
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-600 to-green-700 text-white p-8">
                            <h2 className="text-4xl font-extrabold tracking-wide">
                                Income ({incomes.length})
                            </h2>
                        </div>

                        <div className="p-8 space-y-6">
                            {incomes.length === 0 && (
                                <p className="text-center text-gray-500 text-xl py-10">
                                    No income entries found.
                                </p>
                            )}

                            {incomes.map((inc) => (
                                <div
                                    key={inc._id}
                                    className="p-7 rounded-2xl bg-white shadow-md border border-emerald-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >
                                    <h3 className="text-2xl font-bold text-emerald-700">
                                        {inc.title}
                                    </h3>

                                    <p className="flex items-center gap-2 mt-3 text-gray-600 text-lg">
                                        <FiCalendar /> {new Date(inc.date).toLocaleDateString()}
                                    </p>

                                    <div className="mt-4 flex flex-wrap gap-3">
                                        <span className="px-4 py-2 bg-emerald-100 text-emerald-700 font-semibold rounded-xl text-sm flex items-center gap-2">
                                            <FiTag /> {inc.category}
                                        </span>

                                        <span className="px-4 py-2 bg-indigo-100 text-indigo-700 font-semibold rounded-xl text-sm flex items-center gap-2">
                                            <FiCreditCard /> {inc.paymentMethod}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ========================= EXPENSES ============================= */}
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-rose-600 to-red-700 text-white p-8">
                            <h2 className="text-4xl font-extrabold tracking-wide">
                                Expense ({expenses.length})
                            </h2>
                        </div>

                        <div className="p-8 space-y-6">
                            {expenses.length === 0 && (
                                <p className="text-center text-gray-500 text-xl py-10">
                                    No expense entries found.
                                </p>
                            )}

                            {expenses.map((exp) => (
                                <div
                                    key={exp._id}
                                    className="p-7 rounded-2xl bg-white shadow-md border border-rose-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >
                                    <h3 className="text-2xl font-bold text-rose-700">
                                        {exp.title}
                                    </h3>

                                    <p className="flex items-center gap-2 mt-3 text-gray-600 text-lg">
                                        <FiCalendar /> {new Date(exp.date).toLocaleDateString()}
                                    </p>

                                    <div className="mt-4 flex flex-wrap gap-3">
                                        <span className="px-4 py-2 bg-rose-100 text-rose-700 font-semibold rounded-xl text-sm flex items-center gap-2">
                                            <FiTag /> {exp.category}
                                        </span>

                                        <span className="px-4 py-2 bg-purple-100 text-purple-700 font-semibold rounded-xl text-sm flex items-center gap-2">
                                            <FiCreditCard /> {exp.paymentMethod}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuestProjectView;
