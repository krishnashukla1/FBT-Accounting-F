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

// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../api";
// import { FiCalendar, FiTag, FiCreditCard } from "react-icons/fi";

// const GuestProjectView = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();

//     const [project, setProject] = useState(null);
//     const [incomes, setIncomes] = useState([]);
//     const [expenses, setExpenses] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const load = async () => {
//             try {
//                 const [projRes, incRes, expRes] = await Promise.all([
//                     api.get(`/projects/${id}`),
//                     api.get(`/finance/guest/incomes?project=${id}`),
//                     api.get(`/finance/guest/expenses?project=${id}`),
//                 ]);

//                 setProject(projRes.data.project || projRes.data);
//                 setIncomes(incRes.data.incomes || []);
//                 setExpenses(expRes.data.expenses || []);
//             } catch (err) {
//                 console.error("Guest load error:", err);
//                 alert("Failed to load project data");
//                 navigate("/guestDashboard");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         load();
//     }, [id, navigate]);

//     if (loading)
//         return (
//             <div className="min-h-screen flex items-center justify-center text-4xl">
//                 Loading...
//             </div>
//         );

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-slate-100 to-indigo-200">
//             {/* HEADER */}
//             <header className="fixed top-0 w-full bg-gradient-to-r from-indigo-700 to-purple-800 text-white shadow-2xl z-50">
//                 <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">

//                     {/* <button
//                         onClick={() => navigate("/guestDashboard")}
//                         className="flex items-center gap-3 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
//                     >
//                         Back
//                     </button> */}


//                     <button
//                         onClick={() => navigate("/guestDashboard")}
//                         className="cursor-pointer flex items-center gap-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:opacity-90 transition"
//                     >
//                         Back
//                     </button>

//                     {/* <button
//   onClick={() => navigate("/guestDashboard")}
//   className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition"
// >
//   Back
// </button> */}

//                     <h1 className="text-4xl font-black tracking-wide">
//                         {project?.name} – Guest View
//                     </h1>
//                     <div></div>
//                 </div>
//             </header>

//             <div className="pt-32 px-6 pb-20 max-w-7xl mx-auto">
//                 {/* GRID */}
//                 <div className="grid lg:grid-cols-2 gap-12">
//                     {/* ========================= INCOMES ============================= */}
//                     <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
//                         <div className="bg-gradient-to-r from-emerald-600 to-green-700 text-white p-8">
//                             <h2 className="text-4xl font-extrabold tracking-wide">
//                                 Income ({incomes.length})
//                             </h2>
//                         </div>

//                         <div className="p-8 space-y-6">
//                             {incomes.length === 0 && (
//                                 <p className="text-center text-gray-500 text-xl py-10">
//                                     No income entries found.
//                                 </p>
//                             )}

//                             {incomes.map((inc) => (
//                                 <div
//                                     key={inc._id}
//                                     className="p-7 rounded-2xl bg-white shadow-md border border-emerald-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
//                                 >
//                                     <h3 className="text-2xl font-bold text-emerald-700">
//                                         {inc.title}
//                                     </h3>

//                                     <p className="flex items-center gap-2 mt-3 text-gray-600 text-lg">
//                                         <FiCalendar /> {new Date(inc.date).toLocaleDateString()}
//                                     </p>

//                                     <div className="mt-4 flex flex-wrap gap-3">
//                                         <span className="px-4 py-2 bg-emerald-100 text-emerald-700 font-semibold rounded-xl text-sm flex items-center gap-2">
//                                             <FiTag /> {inc.category}
//                                         </span>

//                                         <span className="px-4 py-2 bg-indigo-100 text-indigo-700 font-semibold rounded-xl text-sm flex items-center gap-2">
//                                             <FiCreditCard /> {inc.paymentMethod}
//                                         </span>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* ========================= EXPENSES ============================= */}
//                     <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
//                         <div className="bg-gradient-to-r from-rose-600 to-red-700 text-white p-8">
//                             <h2 className="text-4xl font-extrabold tracking-wide">
//                                 Expense ({expenses.length})
//                             </h2>
//                         </div>

//                         <div className="p-8 space-y-6">
//                             {expenses.length === 0 && (
//                                 <p className="text-center text-gray-500 text-xl py-10">
//                                     No expense entries found.
//                                 </p>
//                             )}

//                             {expenses.map((exp) => (
//                                 <div
//                                     key={exp._id}
//                                     className="p-7 rounded-2xl bg-white shadow-md border border-rose-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
//                                 >
//                                     <h3 className="text-2xl font-bold text-rose-700">
//                                         {exp.title}
//                                     </h3>

//                                     <p className="flex items-center gap-2 mt-3 text-gray-600 text-lg">
//                                         <FiCalendar /> {new Date(exp.date).toLocaleDateString()}
//                                     </p>

//                                     <div className="mt-4 flex flex-wrap gap-3">
//                                         <span className="px-4 py-2 bg-rose-100 text-rose-700 font-semibold rounded-xl text-sm flex items-center gap-2">
//                                             <FiTag /> {exp.category}
//                                         </span>

//                                         <span className="px-4 py-2 bg-purple-100 text-purple-700 font-semibold rounded-xl text-sm flex items-center gap-2">
//                                             <FiCreditCard /> {exp.paymentMethod}
//                                         </span>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default GuestProjectView;

//=====================new=================

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { FiCalendar, FiTag, FiCreditCard, FiAlignLeft } from "react-icons/fi";

const GuestProjectView = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [selectedMonth, setSelectedMonth] = useState(""); // "1" to "12"
    const [selectedYear, setSelectedYear] = useState("");  // e.g. "2025"

    // Extract available years from data
    const allDates = [...incomes, ...expenses].map(item => new Date(item.date));
    //   const years = [...new Set(allDates.map(d => d.getFullYear()))].sort((a, b) => b - a);
    const years = Array.from({ length: 11 }, (_, i) => 2024 + i);


    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

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

    // Filter logic
    const filterByMonthYear = (items) => {
        return items.filter(item => {
            const date = new Date(item.date);
            const itemMonth = date.getMonth() + 1; // 1-12
            const itemYear = date.getFullYear();

            const monthMatch = selectedMonth === "" || itemMonth === Number(selectedMonth);
            const yearMatch = selectedYear === "" || itemYear === Number(selectedYear);

            return monthMatch && yearMatch;
        });
    };

    const filteredIncomes = filterByMonthYear(incomes);
    const filteredExpenses = filterByMonthYear(expenses);

    const getPeriodText = () => {
        if (!selectedMonth && !selectedYear) return "All Time";
        if (selectedMonth && selectedYear) return `${monthNames[Number(selectedMonth) - 1]} ${selectedYear}`;
        if (selectedYear) return `Year ${selectedYear}`;
        if (selectedMonth) return monthNames[Number(selectedMonth) - 1];
    };

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center text-4xl text-indigo-600">
                Loading...
            </div>
        );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-indigo-200">
            {/* HEADER */}
            <header className="fixed top-0 w-full bg-gradient-to-r from-indigo-700 to-purple-800 text-white shadow-2xl z-50">
                <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <button
                        onClick={() => navigate("/guestDashboard")}
                        className="cursor-pointer flex items-center gap-3 bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-3 rounded-xl hover:opacity-90 transition font-semibold"
                    >
                        Back
                    </button>

                    <h1 className="text-3xl sm:text-4xl font-black tracking-wide text-center">
                        {project?.name} – Guest View
                    </h1>

                    <div></div>
                </div>
            </header>

            {/* FILTER BAR */}
            <div className="pt-32 px-6 pb-6 max-w-7xl mx-auto">
                <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6 mb-8 border border-indigo-200">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <h3 className="text-2xl font-bold text-indigo-800">
                            Viewing: <span className="text-indigo-600">{getPeriodText()}</span>
                        </h3>

                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Month Dropdown */}
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="cursor-pointer px-5 py-3 rounded-xl border-2 border-indigo-300 bg-white text-indigo-800 font-medium focus:outline-none focus:border-indigo-600 transition shadow-md"
                            >
                                <option value="">All Months</option>
                                {monthNames.map((month, idx) => (
                                    <option key={idx + 1} value={idx + 1}>
                                        {month}
                                    </option>
                                ))}
                            </select>

                            {/* Year Dropdown */}
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="cursor-pointer px-5 py-3 rounded-xl border-2 border-indigo-300 bg-white text-indigo-800 font-medium focus:outline-none focus:border-indigo-600 transition shadow-md"
                            >
                                <option value="">All Years</option>
                                {years.map(year => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>


                            {/* Clear Filters */}
                            {(selectedMonth || selectedYear) && (
                                <button
                                    onClick={() => {
                                        setSelectedMonth("");
                                        setSelectedYear("");
                                    }}
                                    className="px-5 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-medium shadow-md"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* GRID */}
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* INCOMES */}
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-600 to-green-700 text-white p-8">
                            <h2 className="text-4xl font-extrabold tracking-wide">
                                Income ({filteredIncomes.length})
                            </h2>
                        </div>

                        <div className="p-8 space-y-6 max-h-screen overflow-y-auto">
                            {filteredIncomes.length === 0 && (
                                <p className="text-center text-gray-500 text-xl py-16 bg-gray-50 rounded-2xl">
                                    {selectedMonth || selectedYear
                                        ? "No income found for selected period."
                                        : "No income entries found."}
                                </p>
                            )}

                            {filteredIncomes.map((inc) => (
                                <div
                                    key={inc._id}
                                    className="p-7 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 shadow-md border border-emerald-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >
                                    <h3 className="text-2xl font-bold text-emerald-700">{inc.title}</h3>
                                    <p className="flex items-center gap-2 mt-3 text-gray-600 text-lg">
                                        <FiCalendar /> {new Date(inc.date).toLocaleDateString("en-IN")}
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-3">
                                        <span className="px-4 py-2 bg-emerald-100 text-emerald-700 font-semibold rounded-xl text-sm flex items-center gap-2">
                                            <FiTag /> {inc.category}
                                        </span>
                                        <span className="px-4 py-2 bg-indigo-100 text-indigo-700 font-semibold rounded-xl text-sm flex items-center gap-2">
                                            <FiCreditCard /> {inc.paymentMethod || "Cash"}
                                        </span>

                                    </div>


                                    {/* <div className="mt-4 flex flex-wrap gap-3">
                                        <span className="px-4 py-2 bg-emerald-100 text-emerald-700 font-semibold rounded-xl text-sm flex items-center gap-2">
                                            <FiTag /> {inc.category}
                                        </span>


                                        <span className="px-4 py-2 bg-indigo-100 text-indigo-700 font-semibold rounded-xl text-sm flex items-center gap-2">
                                            <FiCreditCard /> {inc.paymentMethod || "Cash"}
                                        </span>

                                          // Description (auto-wrap if long)
                                        <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-xl text-sm flex gap-2 items-start max-w-xs break-words">
                                            <FiAlignLeft className="mt-1" />
                                            <span className="leading-tight">
                                                {inc.description ? inc.description : "No Description"}
                                            </span>
                                        </span>
                                    </div> */}

                                </div>
                            ))}
                        </div>
                    </div>

                    {/* EXPENSES */}
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-rose-600 to-red-700 text-white p-8">
                            <h2 className="text-4xl font-extrabold tracking-wide">
                                Expense ({filteredExpenses.length})
                            </h2>
                        </div>

                        <div className="p-8 space-y-6 max-h-screen overflow-y-auto">
                            {filteredExpenses.length === 0 && (
                                <p className="text-center text-gray-500 text-xl py-16 bg-gray-50 rounded-2xl">
                                    {selectedMonth || selectedYear
                                        ? "No expenses found for selected period."
                                        : "No expense entries found."}
                                </p>
                            )}

                            {filteredExpenses.map((exp) => (
                                <div
                                    key={exp._id}
                                    className="p-7 rounded-2xl bg-gradient-to-r from-rose-50 to-red-50 shadow-md border border-rose-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >
                                    <h3 className="text-2xl font-bold text-rose-700">{exp.title}</h3>
                                    <p className="flex items-center gap-2 mt-3 text-gray-600 text-lg">
                                        <FiCalendar /> {new Date(exp.date).toLocaleDateString("en-IN")}
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-3">
                                        <span className="px-4 py-2 bg-rose-100 text-rose-700 font-semibold rounded-xl text-sm flex items-center gap-2">
                                            <FiTag /> {exp.category}
                                        </span>
                                        <span className="px-4 py-2 bg-purple-100 text-purple-700 font-semibold rounded-xl text-sm flex items-center gap-2">
                                            <FiCreditCard /> {exp.paymentMethod || "Cash"}
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


