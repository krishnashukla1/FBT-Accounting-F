//==================live currency OLD CODE===========

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../api";
// import TransactionList from "../components/TransactionList";

// export default function ProjectPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [mode, setMode] = useState("income");
//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(true);
//   // const [liveRates] = useState({ USD: 88.5, AED: 24.1, INR: 1, CAD: 63.8, AUD: 58.4 });

//   const [liveRates, setLiveRates] = useState({ INR: 1 });
//   const [ratesLoading, setRatesLoading] = useState(true);
//   const [ratesError, setRatesError] = useState(false);

//   const CURRENCIES = ["USD", "AED", "INR", "CAD", "AUD"];
//   const currencySymbols = { USD: "$", AED: "د.إ", INR: "₹", CAD: "C$", AUD: "A$" };

//   const INCOME_CATEGORIES = ["MCO Meta", "MCO PPC", "Meta Rental", "Commission", "Technology Sale", "Domestic Tour Package", "International Tour Package", "Airline Ticket", "Hotel", "Car Hire", "Activities", "Airport Transfers", "Visa", "Others"];
//   const EXPENSE_CATEGORIES = ["Salaries", "Incentives", "Rent", "Travel Allowance Agent", "Travel Allowance Owner", "Meta Recharge", "Chargeback", "Refunds", "Miscellaneous Expenses", "Call Payment", "RDP Payment", "Ticket Issuance Pay", "API Payment", "Website Expenses", "Vonage Payment", "PPC Call Payment", "Campaign Payment", "Others"];

//   const [incomeData, setIncomeData] = useState({ title: "", category: "Others", amount: "", currency: "INR", date: new Date().toISOString().split("T")[0], paymentMethod: "cash", description: "" });
//   const [expenseData, setExpenseData] = useState({ title: "", category: "Others", amount: "", currency: "INR", date: new Date().toISOString().split("T")[0], paymentMethod: "cash", description: "" });

//   const [incomes, setIncomes] = useState([]);
//   const [expenses, setExpenses] = useState([]);
//   const [summary, setSummary] = useState(null);
//   const [editingIncome, setEditingIncome] = useState(null);
//   const [editingExpense, setEditingExpense] = useState(null);
//   const [incomePage, setIncomePage] = useState(1);
//   const [expensePage, setExpensePage] = useState(1);

//   // Filter States
//   const [filterMonth, setFilterMonth] = useState("");
//   const [filterYear, setFilterYear] = useState("");

//   const convertFromINR = (amountInINR, targetCurrency) => {
//     if (!amountInINR || isNaN(amountInINR)) return "0.00";
//     if (ratesLoading) return "...";
//     if (ratesError) return "N/A";

//     const rate = liveRates[targetCurrency] || 1;
//     return (Number(amountInINR) / rate).toFixed(2);
//   };


//   // Add this useEffect to fetch live rates
//   useEffect(() => {
//     const fetchLiveRates = async () => {
//       try {
//         setRatesLoading(true);
//         setRatesError(false);
//         const res = await api.get("/finance/rates");
//         if (res.data.success && res.data.rates) {
//           setLiveRates({
//             INR: 1,
//             USD: res.data.rates.USD || 88.5,
//             AED: res.data.rates.AED || 24.1,
//             CAD: res.data.rates.CAD || 63.8,
//             AUD: res.data.rates.AUD || 58.4,
//             // Add more if needed
//           });
//         }
//       } catch (err) {
//         console.error("Failed to load live rates, using fallback", err);
//         setRatesError(true);
//         // Fallback to static rates if API fails
//         setLiveRates({ USD: 88.5, AED: 24.1, INR: 1, CAD: 63.8, AUD: 58.4 });
//       } finally {
//         setRatesLoading(false);
//       }
//     };

//     fetchLiveRates();

//     // Optional: Refresh rates every 10 minutes
//     // const interval = setInterval(fetchLiveRates, 10 * 60 * 1000);
//     // return () => clearInterval(interval);
//   }, []);


//   // Load initial data
//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);
//       try {
//         const [proj, inc, exp, sum] = await Promise.all([
//           api.get(`/projects/${id}`),
//           api.get(`/finance/incomes?project=${id}`),
//           api.get(`/finance/expenses?project=${id}`),
//           api.get(`/finance/summary?project=${id}`).catch(() => ({ data: { success: false } })),
//         ]);

//         if (proj.data.success) setProject(proj.data.project);
//         setIncomes(inc.data.incomes || []);
//         setExpenses(exp.data.expenses || []);
//         if (sum.data.success) setSummary(sum.data.summary);
//       } catch (err) {
//         console.error("Load failed:", err);
//         alert("Failed to load project data");
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (id) load();
//   }, [id]);

//   const refreshData = async () => {
//     try {
//       const [inc, exp, sum] = await Promise.all([
//         api.get(`/finance/incomes?project=${id}`),
//         api.get(`/finance/expenses?project=${id}`),
//         api.get(`/finance/summary?project=${id}`).catch(() => ({ data: {} })),
//       ]);
//       setIncomes(inc.data.incomes || []);
//       setExpenses(exp.data.expenses || []);
//       if (sum.data.success) setSummary(sum.data.summary);
//     } catch (err) {
//       console.error("Refresh failed");
//     }
//   };

//   const handleIncome = async () => {
//     if (!incomeData.title || !incomeData.amount) return alert("Title & Amount required");
//     const payload = { ...incomeData, amount: Number(incomeData.amount), project: id };
//     try {
//       editingIncome
//         ? await api.put(`/finance/income/${editingIncome._id}`, payload)
//         : await api.post("/finance/income", payload);
//       setEditingIncome(null);
//       resetIncomeForm();
//       refreshData();
//     } catch (err) { alert("Save failed"); }
//   };

//   const handleExpense = async () => {
//     if (!expenseData.title || !expenseData.amount) return alert("Title & Amount required");
//     const payload = { ...expenseData, amount: Number(expenseData.amount), project: id };
//     try {
//       editingExpense
//         ? await api.put(`/finance/expense/${editingExpense._id}`, payload)
//         : await api.post("/finance/expense", payload);
//       setEditingExpense(null);
//       resetExpenseForm();
//       refreshData();
//     } catch (err) { alert("Save failed"); }
//   };

//   const resetIncomeForm = () => setIncomeData({ title: "", category: "Others", amount: "", currency: "INR", date: new Date().toISOString().split("T")[0], paymentMethod: "cash", description: "" });
//   const resetExpenseForm = () => setExpenseData({ title: "", category: "Others", amount: "", currency: "INR", date: new Date().toISOString().split("T")[0], paymentMethod: "cash", description: "" });

//   const startEditIncome = (i) => {
//     setEditingIncome(i);
//     setIncomeData({
//       title: i.title,
//       category: i.category,
//       amount: i.amount,
//       currency: i.currency,
//       date: i.date.split("T")[0],
//       paymentMethod: i.paymentMethod || "cash",
//       description: i.description || ""
//     });
//   };

//   const startEditExpense = (e) => {
//     setEditingExpense(e);
//     setExpenseData({
//       title: e.title,
//       category: e.category,
//       amount: e.amount,
//       currency: e.currency,
//       date: e.date.split("T")[0],
//       paymentMethod: e.paymentMethod || "cash",
//       description: e.description || ""
//     });
//   };

//   const cancelEdit = () => {
//     setEditingIncome(null);
//     setEditingExpense(null);
//     resetIncomeForm();
//     resetExpenseForm();
//   };

//   const deleteIncome = async (id) => { if (confirm("Delete this income?")) { await api.delete(`/finance/income/${id}`); refreshData(); } };
//   const deleteExpense = async (id) => { if (confirm("Delete this expense?")) { await api.delete(`/finance/expense/${id}`); refreshData(); } };

//   // Filtering Logic (shared for both income & expense)
//   const applyFilter = (items) => {
//     return items.filter((item) => {
//       if (!filterMonth && !filterYear) return true;

//       const date = new Date(item.date);
//       const month = date.getMonth() + 1; // 1-12
//       const year = date.getFullYear();

//       const monthMatch = filterMonth ? month === Number(filterMonth) : true;
//       const yearMatch = filterYear ? year === Number(filterYear) : true;

//       return monthMatch && yearMatch;
//     });
//   };

//   const filteredIncomes = applyFilter(incomes);
//   const filteredExpenses = applyFilter(expenses);

//   const clearFilters = () => {
//     setFilterMonth("");
//     setFilterYear("");
//   };

//   const downloadReport = async () => {
//     try {
//       const res = await api.get(`/finance/download?project=${id}`, { responseType: "blob" });
//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `${project?.name || "Project"}-Report.xlsx`;
//       a.click();
//     } catch (err) { alert("Download failed"); }
//   };

//   if (loading) return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center"><div className="animate-spin h-12 w-12 border-4 border-blue-600 rounded-full border-t-transparent"></div></div>;
//   if (!project) return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-red-600 text-xl">Project not found</div>;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-2xl sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
//           <div className="flex items-center gap-6">
//             <button onClick={() => navigate("/dashboard")} className="cursor-pointer px-6 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-all flex items-center gap-2">
//               Back to Projects
//             </button>
//             <div className="text-white">
//               <h1 className="text-4xl font-bold">{project.name}</h1>
//               <p className="text-blue-100 mt-2 text-lg">{project.description || "No description"}</p>
//             </div>
//           </div>
//           <button onClick={downloadReport} className="cursor-pointer px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-xl shadow-2xl transition-all flex items-center gap-3">
//             Download Excel Report
//           </button>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-10">

//         {/* Summary Cards */}
//         {summary && (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
//               {/* Total Income */}
//               <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-2xl p-8 shadow-2xl">
//                 <p className="text-emerald-100 font-semibold text-lg">Total Income</p>
//                 <p className="text-5xl font-black mt-4">₹ {(summary.totalIncomeINR || 0).toLocaleString("en-IN")}</p>
//               </div>

//               {/* Total Expenses */}
//               <div className="bg-gradient-to-br from-rose-500 to-red-600 text-white rounded-2xl p-8 shadow-2xl">
//                 <p className="text-rose-100 font-semibold text-lg">Total Expenses</p>
//                 <p className="text-5xl font-black mt-4">₹ {(summary.totalExpenseINR || 0).toLocaleString("en-IN")}</p>
//               </div>

//               {/* Balance */}
//               <div className={`bg-gradient-to-br ${summary.balanceINR >= 0 ? "from-blue-500 to-cyan-600" : "from-amber-500 to-orange-600"} text-white rounded-2xl p-8 shadow-2xl`}>
//                 <p className="text-blue-100 font-semibold text-lg">Balance</p>
//                 <p className="text-5xl font-black mt-4">
//                   ₹ {Math.abs(summary.balanceINR || 0).toLocaleString("en-IN")}
//                   {summary.balanceINR < 0 && <span className="text-lg block mt-2">(Deficit)</span>}
//                 </p>
//               </div>
//             </div>
//           </>
//         )}
//         {/* Add this near your summary cards */}

//         {ratesLoading && (
//           <div className="text-center text-sm text-gray-500 mb-4">
//             Updating live exchange rates...
//           </div>
//         )}
//         {ratesError && (
//           <div className="text-center text-sm text-orange-600 mb-4">
//             Live rates unavailable • Using last known rates
//           </div>
//         )}
//         {/* GLOBAL FILTER BAR (shared for both tabs) */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex flex-wrap items-end gap-6">
//           <div className="flex-1 min-w-[200px]">
//             <label className="block text-gray-700 font-bold mb-2">Filter by Month</label>
//             <select
//               value={filterMonth}
//               onChange={(e) => setFilterMonth(e.target.value)}
//               className="cursor-pointer w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
//             >
//               <option value="">All Months</option>
//               {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m, i) => (
//                 <option key={i + 1} value={i + 1}>{m}</option>
//               ))}
//             </select>
//           </div>

//           <div className="flex-1 min-w-[200px]">
//             <label className="block text-gray-700 font-bold mb-2">Filter by Year</label>
//             {/* <select
//               value={filterYear}
//               onChange={(e) => setFilterYear(e.target.value)}
//               className="cursor-pointer w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
//             >
//               <option value="">All Years</option>
//               <option value="2023">2023</option>
//               <option value="2024">2024</option>
//               <option value="2025">2025</option>
//               <option value="2026">2026</option>
//               <option value="2027">2027</option>
//               <option value="2028">2028</option>
//               <option value="2029">2029</option>
//               <option value="2030">2030</option>
//               <option value="2031">2031</option>
//               <option value="2032">2032</option>
//               <option value="2033">2033</option>
//               <option value="2034">2034</option>
//               <option value="2035">2035</option>
//               <option value="2036">2036</option>
//               <option value="2037">2037</option>
//               <option value="2037">2038</option>
//             </select> */}
//             <select
//               value={filterYear}
//               onChange={(e) => setFilterYear(e.target.value)}
//               className="cursor-pointer w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
//             >
//               <option value="">All Years</option>
//               {[2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032].map(year => (
//                 <option key={year} value={year}>{year}</option>
//               ))}
//             </select>
//           </div>

//           <button
//             onClick={clearFilters}
//             className="cursor-pointer px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all"
//           >
//             Clear Filters
//           </button>
//         </div>

//         {/* Main Content */}
//         <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
//           {/* Tabs */}
//           <div className="flex border-b bg-gradient-to-r from-gray-50 to-blue-50/50">
//             <button
//               onClick={() => { setMode("income"); cancelEdit(); }}
//               className={`cursor-pointer flex-1 py-6 text-xl font-black transition-all relative ${mode === "income" ? "text-blue-700 bg-white shadow-lg" : "text-gray-500 hover:text-gray-800"}`}
//             >
//               {editingIncome ? "Edit Income" : "Add Income"}
//               {mode === "income" && <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>}
//             </button>
//             <button
//               onClick={() => { setMode("expense"); cancelEdit(); }}
//               className={`cursor-pointer flex-1 py-6 text-xl font-black transition-all relative ${mode === "expense" ? "text-blue-700 bg-white shadow-lg" : "text-gray-500 hover:text-gray-800"}`}
//             >
//               {editingExpense ? "Edit Expense" : "Add Expense"}
//               {mode === "expense" && <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>}
//             </button>
//           </div>

//           <div className="p-10">
//             {mode === "income" ? (
//               <div className="space-y-12">
//                 {/* Income Form */}
//                 <div className="bg-gradient-to-br from-green-50 to-emerald-100/50 rounded-2xl p-8 border-2 border-emerald-200/50 shadow-lg">
//                   <div className="flex items-center justify-between mb-8">
//                     <h3 className="text-3xl font-black text-gray-800">
//                       {editingIncome ? "Edit Income" : "Add New Income"}
//                     </h3>
//                     {editingIncome && (
//                       <button
//                         onClick={cancelEdit}
//                         className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all"
//                       >
//                         Cancel
//                       </button>
//                     )}
//                   </div>

//                   {/* Row 1: Title, Category, Amount, Currency */}
//                   <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Title *</label>
//                       <input
//                         type="text"
//                         placeholder="Enter title"
//                         value={incomeData.title}
//                         onChange={(e) => setIncomeData({ ...incomeData, title: e.target.value })}
//                         className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
//                       <select
//                         value={incomeData.category}
//                         onChange={(e) => setIncomeData({ ...incomeData, category: e.target.value })}
//                         className="cursor-pointer w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 bg-white shadow-sm"
//                       >
//                         {INCOME_CATEGORIES.map((c) => (
//                           <option key={c} value={c}>{c}</option>
//                         ))}
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Amount *</label>
//                       <input
//                         type="number"
//                         placeholder="0.00"
//                         value={incomeData.amount}
//                         onChange={(e) => setIncomeData({ ...incomeData, amount: e.target.value })}
//                         className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Currency</label>
//                       <select
//                         value={incomeData.currency}
//                         onChange={(e) => setIncomeData({ ...incomeData, currency: e.target.value })}
//                         className="cursor-pointer w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 bg-white shadow-sm"
//                       >
//                         {CURRENCIES.map((c) => (
//                           <option key={c} value={c}>{c}</option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   {/* Row 2: Date, Payment Method, Description */}
//                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
//                       <input
//                         type="date"
//                         value={incomeData.date}
//                         onChange={(e) => setIncomeData({ ...incomeData, date: e.target.value })}
//                         className="cursor-pointer w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Payment Method</label>
//                       <select
//                         value={incomeData.paymentMethod}
//                         onChange={(e) => setIncomeData({ ...incomeData, paymentMethod: e.target.value })}
//                         className="cursor-pointer w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 bg-white shadow-sm"
//                       >
//                         <option value="cash">Cash</option>
//                         <option value="bank">Bank Transfer</option>
//                         <option value="upi">UPI</option>
//                         <option value="card">Card</option>
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
//                       <textarea
//                         placeholder="Optional notes..."
//                         value={incomeData.description}
//                         onChange={(e) => setIncomeData({ ...incomeData, description: e.target.value })}
//                         rows={1}
//                         className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl resize-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>
//                   </div>

//                   {/* Save Button */}
//                   <div className="flex justify-end">
//                     <button
//                       onClick={handleIncome}
//                       className="cursor-pointer px-10 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-xl shadow-2xl transition-all transform hover:scale-105 text-lg"
//                     >
//                       {editingIncome ? "Update Income" : "Save Income"}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Income List */}
//                 <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-200/50 shadow-xl">
//                   <h3 className="text-3xl font-black text-green-700 mb-6 flex items-center justify-between">
//                     Recent Incomes
//                     <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-lg font-bold">
//                       {filteredIncomes.length} {filteredIncomes.length === 1 ? "item" : "items"}
//                     </span>
//                   </h3>
//                   <TransactionList
//                     items={filteredIncomes}
//                     type="income"
//                     onEdit={startEditIncome}
//                     onDelete={deleteIncome}
//                     currentPage={incomePage}
//                     setCurrentPage={setIncomePage}
//                   />
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-12">
//                 {/* Expense Form */}
//                 <div className="bg-gradient-to-br from-rose-50 to-red-100/50 rounded-2xl p-8 border-2 border-rose-200/50 shadow-lg">
//                   <div className="flex items-center justify-between mb-8">
//                     <h3 className="text-3xl font-black text-gray-800">
//                       {editingExpense ? "Edit Expense" : "Add New Expense"}
//                     </h3>
//                     {editingExpense && (
//                       <button
//                         onClick={cancelEdit}
//                         className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all"
//                       >
//                         Cancel
//                       </button>
//                     )}
//                   </div>

//                   {/* Row 1 */}
//                   <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Title *</label>
//                       <input
//                         type="text"
//                         placeholder="Enter title"
//                         value={expenseData.title}
//                         onChange={(e) => setExpenseData({ ...expenseData, title: e.target.value })}
//                         className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-rose-200 focus:border-rose-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
//                       <select
//                         value={expenseData.category}
//                         onChange={(e) => setExpenseData({ ...expenseData, category: e.target.value })}
//                         className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-rose-200 bg-white shadow-sm cursor-pointer"
//                       >
//                         {EXPENSE_CATEGORIES.map((c) => (
//                           <option key={c} value={c}>{c}</option>
//                         ))}
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Amount *</label>
//                       <input
//                         type="number"
//                         placeholder="0.00"
//                         value={expenseData.amount}
//                         onChange={(e) => setExpenseData({ ...expenseData, amount: e.target.value })}
//                         className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-rose-200 focus:border-rose-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Currency</label>
//                       <select
//                         value={expenseData.currency}
//                         onChange={(e) => setExpenseData({ ...expenseData, currency: e.target.value })}
//                         className="cursor-pointer w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-rose-200 bg-white shadow-sm"
//                       >
//                         {CURRENCIES.map((c) => (
//                           <option key={c} value={c}>{c}</option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   {/* Row 2 */}
//                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
//                       <input
//                         type="date"
//                         value={expenseData.date}
//                         onChange={(e) => setExpenseData({ ...expenseData, date: e.target.value })}
//                         className="cursor-pointer w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-rose-200 focus:border-rose-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Payment Method</label>
//                       <select
//                         value={expenseData.paymentMethod}
//                         onChange={(e) => setExpenseData({ ...expenseData, paymentMethod: e.target.value })}
//                         className="cursor-pointer w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-rose-200 bg-white shadow-sm"
//                       >
//                         <option value="cash">Cash</option>
//                         <option value="bank">Bank Transfer</option>
//                         <option value="upi">UPI</option>
//                         <option value="card">Card</option>
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
//                       <textarea
//                         placeholder="Optional notes..."
//                         value={expenseData.description}
//                         onChange={(e) => setExpenseData({ ...expenseData, description: e.target.value })}
//                         rows={1}
//                         className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl resize-none focus:ring-4 focus:ring-rose-200 focus:border-rose-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>
//                   </div>

//                   {/* Save Button */}
//                   <div className="flex justify-end">
//                     <button
//                       onClick={handleExpense}
//                       className="cursor-pointer px-10 py-4 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-bold rounded-xl shadow-2xl transition-all transform hover:scale-105 text-lg"
//                     >
//                       {editingExpense ? "Update Expense" : "Save Expense"}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Expense List */}
//                 <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-200/50 shadow-xl">
//                   <h3 className="text-3xl font-black text-red-700 mb-6 flex items-center justify-between">
//                     Recent Expenses
//                     <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-lg font-bold">
//                       {filteredExpenses.length} {filteredExpenses.length === 1 ? "item" : "items"}
//                     </span>
//                   </h3>
//                   <TransactionList
//                     items={filteredExpenses}
//                     type="expense"
//                     onEdit={startEditExpense}
//                     onDelete={deleteExpense}
//                     currentPage={expensePage}
//                     setCurrentPage={setExpensePage}
//                   />
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

//========================correct fully(all filter by full year)========================

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../api";
// import TransactionList from "../components/TransactionList";

// export default function ProjectPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [mode, setMode] = useState("income");
//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(true);
//   // const [liveRates] = useState({ USD: 88.5, AED: 24.1, INR: 1, CAD: 63.8, AUD: 58.4 });

//   const [liveRates, setLiveRates] = useState({ INR: 1 });
//   const [ratesLoading, setRatesLoading] = useState(true);
//   const [ratesError, setRatesError] = useState(false);

//   const CURRENCIES = ["USD", "AED", "INR", "CAD", "AUD"];
//   const currencySymbols = { USD: "$", AED: "د.إ", INR: "₹", CAD: "C$", AUD: "A$" };

//   const INCOME_CATEGORIES = ["MCO Meta", "MCO PPC", "Meta Rental", "Commission", "Technology Sale", "Domestic Tour Package", "International Tour Package", "Airline Ticket", "Hotel", "Car Hire", "Activities", "Airport Transfers", "Visa", "Others"];
//   const EXPENSE_CATEGORIES = ["Salaries", "Incentives", "Rent", "Travel Allowance Agent", "Travel Allowance Owner", "Meta Recharge", "Chargeback", "Refunds", "Miscellaneous Expenses", "Call Payment", "RDP Payment", "Ticket Issuance Pay", "API Payment", "Website Expenses", "Vonage Payment", "PPC Call Payment", "Campaign Payment", "Others"];

//   const [incomeData, setIncomeData] = useState({ title: "", category: "Others", amount: "", currency: "INR", date: new Date().toISOString().split("T")[0], paymentMethod: "cash", description: "" });
//   const [expenseData, setExpenseData] = useState({ title: "", category: "Others", amount: "", currency: "INR", date: new Date().toISOString().split("T")[0], paymentMethod: "cash", description: "" });

//   const [incomes, setIncomes] = useState([]);
//   const [expenses, setExpenses] = useState([]);
//   const [summary, setSummary] = useState(null);
//   const [editingIncome, setEditingIncome] = useState(null);
//   const [editingExpense, setEditingExpense] = useState(null);
//   const [incomePage, setIncomePage] = useState(1);
//   const [expensePage, setExpensePage] = useState(1);

//   // Filter States
//   const [filterMonth, setFilterMonth] = useState("");
//   const [filterYear, setFilterYear] = useState("");

//   const convertFromINR = (amountInINR, targetCurrency) => {
//     if (!amountInINR || isNaN(amountInINR)) return "0.00";
//     if (ratesLoading) return "...";
//     if (ratesError) return "N/A";

//     const rate = liveRates[targetCurrency] || 1;
//     return (Number(amountInINR) / rate).toFixed(2);
//   };


//   // Add this useEffect to fetch live rates
//   useEffect(() => {
//     const fetchLiveRates = async () => {
//       try {
//         setRatesLoading(true);
//         setRatesError(false);
//         const res = await api.get("/finance/rates");
//         if (res.data.success && res.data.rates) {
//           setLiveRates({
//             INR: 1,
//             USD: res.data.rates.USD || 88.5,
//             AED: res.data.rates.AED || 24.1,
//             CAD: res.data.rates.CAD || 63.8,
//             AUD: res.data.rates.AUD || 58.4,
//             // Add more if needed
//           });
//         }
//       } catch (err) {
//         console.error("Failed to load live rates, using fallback", err);
//         setRatesError(true);
//         // Fallback to static rates if API fails
//         setLiveRates({ USD: 88.5, AED: 24.1, INR: 1, CAD: 63.8, AUD: 58.4 });
//       } finally {
//         setRatesLoading(false);
//       }
//     };

//     fetchLiveRates();

//     // Optional: Refresh rates every 10 minutes
//     // const interval = setInterval(fetchLiveRates, 10 * 60 * 1000);
//     // return () => clearInterval(interval);
//   }, []);


//   // Load initial data
//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);
//       try {
//         const [proj, inc, exp, sum] = await Promise.all([
//           api.get(`/projects/${id}`),
//           api.get(`/finance/incomes?project=${id}`),
//           api.get(`/finance/expenses?project=${id}`),
//           api.get(`/finance/summary?project=${id}`).catch(() => ({ data: { success: false } })),
//         ]);

//         if (proj.data.success) setProject(proj.data.project);
//         setIncomes(inc.data.incomes || []);
//         setExpenses(exp.data.expenses || []);
//         if (sum.data.success) setSummary(sum.data.summary);
//       } catch (err) {
//         console.error("Load failed:", err);
//         alert("Failed to load project data");
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (id) load();
//   }, [id]);

//   const refreshData = async () => {
//     try {
//       const [inc, exp, sum] = await Promise.all([
//         api.get(`/finance/incomes?project=${id}`),
//         api.get(`/finance/expenses?project=${id}`),
//         api.get(`/finance/summary?project=${id}`).catch(() => ({ data: {} })),
//       ]);
//       setIncomes(inc.data.incomes || []);
//       setExpenses(exp.data.expenses || []);
//       if (sum.data.success) setSummary(sum.data.summary);
//     } catch (err) {
//       console.error("Refresh failed");
//     }
//   };

//   const handleIncome = async () => {
//     if (!incomeData.title || !incomeData.amount) return alert("Title & Amount required");
//     const payload = { ...incomeData, amount: Number(incomeData.amount), project: id };
//     try {
//       editingIncome
//         ? await api.put(`/finance/income/${editingIncome._id}`, payload)
//         : await api.post("/finance/income", payload);
//       setEditingIncome(null);
//       resetIncomeForm();
//       refreshData();
//     } catch (err) { alert("Save failed"); }
//   };

//   const handleExpense = async () => {
//     if (!expenseData.title || !expenseData.amount) return alert("Title & Amount required");
//     const payload = { ...expenseData, amount: Number(expenseData.amount), project: id };
//     try {
//       editingExpense
//         ? await api.put(`/finance/expense/${editingExpense._id}`, payload)
//         : await api.post("/finance/expense", payload);
//       setEditingExpense(null);
//       resetExpenseForm();
//       refreshData();
//     } catch (err) { alert("Save failed"); }
//   };

//   const resetIncomeForm = () => setIncomeData({ title: "", category: "Others", amount: "", currency: "INR", date: new Date().toISOString().split("T")[0], paymentMethod: "cash", description: "" });
//   const resetExpenseForm = () => setExpenseData({ title: "", category: "Others", amount: "", currency: "INR", date: new Date().toISOString().split("T")[0], paymentMethod: "cash", description: "" });

//   const startEditIncome = (i) => {
//     setEditingIncome(i);
//     setIncomeData({
//       title: i.title,
//       category: i.category,
//       amount: i.amount,
//       currency: i.currency,
//       date: i.date.split("T")[0],
//       paymentMethod: i.paymentMethod || "cash",
//       description: i.description || ""
//     });
//   };

//   const startEditExpense = (e) => {
//     setEditingExpense(e);
//     setExpenseData({
//       title: e.title,
//       category: e.category,
//       amount: e.amount,
//       currency: e.currency,
//       date: e.date.split("T")[0],
//       paymentMethod: e.paymentMethod || "cash",
//       description: e.description || ""
//     });
//   };

//   const cancelEdit = () => {
//     setEditingIncome(null);
//     setEditingExpense(null);
//     resetIncomeForm();
//     resetExpenseForm();
//   };

//   const deleteIncome = async (id) => { if (confirm("Delete this income?")) { await api.delete(`/finance/income/${id}`); refreshData(); } };
//   const deleteExpense = async (id) => { if (confirm("Delete this expense?")) { await api.delete(`/finance/expense/${id}`); refreshData(); } };

//   // Filtering Logic (shared for both income & expense)
//   const applyFilter = (items) => {
//     return items.filter((item) => {
//       if (!filterMonth && !filterYear) return true;

//       const date = new Date(item.date);
//       const month = date.getMonth() + 1; // 1-12
//       const year = date.getFullYear();

//       const monthMatch = filterMonth ? month === Number(filterMonth) : true;
//       const yearMatch = filterYear ? year === Number(filterYear) : true;

//       return monthMatch && yearMatch;
//     });
//   };

//   const filteredIncomes = applyFilter(incomes);
//   const filteredExpenses = applyFilter(expenses);

//   const clearFilters = () => {
//     setFilterMonth("");
//     setFilterYear("");
//   };

//   const downloadReport = async () => {
//     try {
//       const res = await api.get(`/finance/download?project=${id}`, { responseType: "blob" });
//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `${project?.name || "Project"}-Report.xlsx`;
//       a.click();
//     } catch (err) { alert("Download failed"); }
//   };

//   if (loading) return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center"><div className="animate-spin h-12 w-12 border-4 border-blue-600 rounded-full border-t-transparent"></div></div>;
//   if (!project) return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-red-600 text-xl">Project not found</div>;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-2xl sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
//           <div className="flex items-center gap-6">
//             <button onClick={() => navigate("/dashboard")} className="cursor-pointer px-6 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-all flex items-center gap-2">
//               Back to Projects
//             </button>
//             <div className="text-white">
//               <h1 className="text-4xl font-bold">{project.name}</h1>
//               <p className="text-blue-100 mt-2 text-lg">{project.description || "No description"}</p>
//             </div>
//           </div>
//           <button onClick={downloadReport} className="cursor-pointer px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-xl shadow-2xl transition-all flex items-center gap-3">
//             Download Excel Report
//           </button>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-10">

//         {/* Summary Cards */}
//         {summary && (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
//               {/* Total Income */}
//               <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-2xl p-8 shadow-2xl">
//                 <p className="text-emerald-100 font-semibold text-lg">Total Income</p>
//                 <p className="text-5xl font-black mt-4">₹ {(summary.totalIncomeINR || 0).toLocaleString("en-IN")}</p>
//               </div>

//               {/* Total Expenses */}
//               <div className="bg-gradient-to-br from-rose-500 to-red-600 text-white rounded-2xl p-8 shadow-2xl">
//                 <p className="text-rose-100 font-semibold text-lg">Total Expenses</p>
//                 <p className="text-5xl font-black mt-4">₹ {(summary.totalExpenseINR || 0).toLocaleString("en-IN")}</p>
//               </div>

//               {/* Balance */}
//               <div className={`bg-gradient-to-br ${summary.balanceINR >= 0 ? "from-blue-500 to-cyan-600" : "from-amber-500 to-orange-600"} text-white rounded-2xl p-8 shadow-2xl`}>
//                 <p className="text-blue-100 font-semibold text-lg">Balance</p>
//                 <p className="text-5xl font-black mt-4">
//                   ₹ {Math.abs(summary.balanceINR || 0).toLocaleString("en-IN")}
//                   {summary.balanceINR < 0 && <span className="text-lg block mt-2">(Deficit)</span>}
//                 </p>
//               </div>
//             </div>
//           </>
//         )}
//         {/* Add this near your summary cards */}




//         {ratesLoading && (
//           <div className="text-center text-sm text-gray-500 mb-4">
//             Updating live exchange rates...
//           </div>
//         )}
//         {ratesError && (
//           <div className="text-center text-sm text-orange-600 mb-4">
//             Live rates unavailable • Using last known rates
//           </div>
//         )}
//         {/* GLOBAL FILTER BAR (shared for both tabs) */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex flex-wrap items-end gap-6">
//           <div className="flex-1 min-w-[200px]">
//             <label className="block text-gray-700 font-bold mb-2">Filter by Month</label>
//             <select
//               value={filterMonth}
//               onChange={(e) => setFilterMonth(e.target.value)}
//               className="cursor-pointer w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
//             >
//               <option value="">All Months</option>
//               {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m, i) => (
//                 <option key={i + 1} value={i + 1}>{m}</option>
//               ))}
//             </select>
//           </div>

//           <div className="flex-1 min-w-[200px]">
//             <label className="block text-gray-700 font-bold mb-2">Filter by Year</label>
//             {/* <select
//               value={filterYear}
//               onChange={(e) => setFilterYear(e.target.value)}
//               className="cursor-pointer w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
//             >
//               <option value="">All Years</option>
//               <option value="2023">2023</option>
//               <option value="2024">2024</option>
//               <option value="2025">2025</option>
//               <option value="2026">2026</option>
//               <option value="2027">2027</option>
//               <option value="2028">2028</option>
//               <option value="2029">2029</option>
//               <option value="2030">2030</option>
//               <option value="2031">2031</option>
//               <option value="2032">2032</option>
//               <option value="2033">2033</option>
//               <option value="2034">2034</option>
//               <option value="2035">2035</option>
//               <option value="2036">2036</option>
//               <option value="2037">2037</option>
//               <option value="2037">2038</option>
//             </select> */}
//             <select
//               value={filterYear}
//               onChange={(e) => setFilterYear(e.target.value)}
//               className="cursor-pointer w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
//             >
//               <option value="">All Years</option>
//               {[2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032].map(year => (
//                 <option key={year} value={year}>{year}</option>
//               ))}
//             </select>
//           </div>

//           <button
//             onClick={clearFilters}
//             className="cursor-pointer px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all"
//           >
//             Clear Filters
//           </button>
//         </div>

//         {/* Main Content */}
//         <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
//           {/* Tabs */}
//           <div className="flex border-b bg-gradient-to-r from-gray-50 to-blue-50/50">
//             <button
//               onClick={() => { setMode("income"); cancelEdit(); }}
//               className={`cursor-pointer flex-1 py-6 text-xl font-black transition-all relative ${mode === "income" ? "text-blue-700 bg-white shadow-lg" : "text-gray-500 hover:text-gray-800"}`}
//             >
//               {editingIncome ? "Edit Income" : "Add Income"}
//               {mode === "income" && <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>}
//             </button>
//             <button
//               onClick={() => { setMode("expense"); cancelEdit(); }}
//               className={`cursor-pointer flex-1 py-6 text-xl font-black transition-all relative ${mode === "expense" ? "text-blue-700 bg-white shadow-lg" : "text-gray-500 hover:text-gray-800"}`}
//             >
//               {editingExpense ? "Edit Expense" : "Add Expense"}
//               {mode === "expense" && <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>}
//             </button>
//           </div>

//           <div className="p-10">
//             {mode === "income" ? (
//               <div className="space-y-12">
//                 {/* Income Form */}
//                 <div className="bg-gradient-to-br from-green-50 to-emerald-100/50 rounded-2xl p-8 border-2 border-emerald-200/50 shadow-lg">
//                   <div className="flex items-center justify-between mb-8">
//                     <h3 className="text-3xl font-black text-gray-800">
//                       {editingIncome ? "Edit Income" : "Add New Income"}
//                     </h3>
//                     {editingIncome && (
//                       <button
//                         onClick={cancelEdit}
//                         className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all"
//                       >
//                         Cancel
//                       </button>
//                     )}
//                   </div>

//                   {/* Row 1: Title, Category, Amount, Currency */}
//                   <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Title *</label>
//                       <input
//                         type="text"
//                         placeholder="Enter title"
//                         value={incomeData.title}
//                         onChange={(e) => setIncomeData({ ...incomeData, title: e.target.value })}
//                         className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
//                       <select
//                         value={incomeData.category}
//                         onChange={(e) => setIncomeData({ ...incomeData, category: e.target.value })}
//                         className="cursor-pointer w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 bg-white shadow-sm"
//                       >
//                         {INCOME_CATEGORIES.map((c) => (
//                           <option key={c} value={c}>{c}</option>
//                         ))}
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Amount *</label>
//                       <input
//                         type="number"
//                         placeholder="0.00"
//                         value={incomeData.amount}
//                         onChange={(e) => setIncomeData({ ...incomeData, amount: e.target.value })}
//                         className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Currency</label>
//                       <select
//                         value={incomeData.currency}
//                         onChange={(e) => setIncomeData({ ...incomeData, currency: e.target.value })}
//                         className="cursor-pointer w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 bg-white shadow-sm"
//                       >
//                         {CURRENCIES.map((c) => (
//                           <option key={c} value={c}>{c}</option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   {/* Row 2: Date, Payment Method, Description */}
//                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
//                       <input
//                         type="date"
//                         value={incomeData.date}
//                         onChange={(e) => setIncomeData({ ...incomeData, date: e.target.value })}
//                         className="cursor-pointer w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Payment Method</label>
//                       <select
//                         value={incomeData.paymentMethod}
//                         onChange={(e) => setIncomeData({ ...incomeData, paymentMethod: e.target.value })}
//                         className="cursor-pointer w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 bg-white shadow-sm"
//                       >
//                         <option value="cash">Cash</option>
//                         <option value="bank">Bank Transfer</option>
//                         <option value="upi">UPI</option>
//                         <option value="card">Card</option>
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
//                       <textarea
//                         placeholder="Optional notes..."
//                         value={incomeData.description}
//                         onChange={(e) => setIncomeData({ ...incomeData, description: e.target.value })}
//                         rows={1}
//                         className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl resize-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>
//                   </div>

//                   {/* Save Button */}
//                   <div className="flex justify-end">
//                     <button
//                       onClick={handleIncome}
//                       className="cursor-pointer px-10 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-xl shadow-2xl transition-all transform hover:scale-105 text-lg"
//                     >
//                       {editingIncome ? "Update Income" : "Save Income"}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Filtered Summary Cards - Based on Current Filter */}
//                 {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">

//                   <div className="bg-gradient-to-br from-rose-500 to-red-600 text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden">
//                     <p className="text-rose-100 font-semibold text-lg">Filtered Total Expenses</p>
//                     <p className="text-5xl font-black mt-4">
//                       ₹ {filteredExpenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0).toLocaleString("en-IN")}
//                     </p>
//                     {(filterMonth || filterYear) && (
//                       <div className="text-xs mt-3 opacity-90">
//                         {filterMonth && `${new Date(2025, filterMonth - 1).toLocaleString('default', { month: 'long' })} `}
//                         {filterYear && `${filterYear}`}
//                       </div>
//                     )}
//                   </div>


//                   <div className={`bg-gradient-to-br ${filteredIncomes.reduce((s, i) => s + Number(i.amount || 0), 0) >= filteredExpenses.reduce((s, e) => s + Number(e.amount || 0), 0)
//                     ? "from-blue-500 to-cyan-600"
//                     : "from-amber-600 to-orange-700"} 
//               text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden`}>
//                     <p className="font-semibold text-lg opacity-90">Balance (Income - Expense)</p>
//                     <p className="text-5xl font-black mt-4">
//                       ₹ {(
//                         filteredIncomes.reduce((s, i) => s + Number(i.amount || 0), 0) -
//                         filteredExpenses.reduce((s, e) => s + Number(e.amount || 0), 0)
//                       ).toLocaleString("en-IN")}
//                     </p>
//                     {(filterMonth || filterYear) && (
//                       <div className="text-xs mt-3 opacity-90">
//                         {filterMonth && `${new Date(2025, filterMonth - 1).toLocaleString('default', { month: 'long' })} `}
//                         {filterYear && `${filterYear}`}
//                       </div>
//                     )}
//                     {filteredIncomes.reduce((s, i) => s + Number(i.amount || 0), 0) <
//                       filteredExpenses.reduce((s, e) => s + Number(e.amount || 0), 0) && (
//                         <span className="block mt-2 text-lg font-bold">Deficit</span>
//                       )}
//                   </div>

//                   <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-2xl p-8 shadow-2xl">
//                     <p className="text-emerald-100 font-semibold text-lg">Filtered Total Income</p>
//                     <p className="text-5xl font-black mt-4">
//                       ₹ {filteredIncomes.reduce((sum, inc) => sum + Number(inc.amount || 0), 0).toLocaleString("en-IN")}
//                     </p>
//                     {(filterMonth || filterYear) && (
//                       <div className="text-xs mt-3 opacity-90">
//                         {filterMonth && `${new Date(2025, filterMonth - 1).toLocaleString('default', { month: 'long' })} `}
//                         {filterYear && `${filterYear}`}
//                       </div>
//                     )}
//                   </div>
//                 </div> */}

//                 {/* Filtered Summary Cards - Based on Current Filter */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
//                   {/* Filtered Total Expenses */}
//                   <div className="bg-gradient-to-br from-rose-500 to-red-600 text-white rounded-2xl p-6 shadow-2xl relative overflow-hidden">
//                     <div className="flex justify-between items-start mb-4">
//                       <p className="text-rose-100 font-semibold text-base">Total Expenses</p>
//                       {(filterMonth || filterYear) && (
//                         <span className="bg-white/20 px-2 py-1 rounded-lg text-xs font-medium">
//                           {filterMonth && `${new Date(2000, filterMonth - 1).toLocaleString('default', { month: 'short' })}`}
//                           {filterYear && ` ${filterYear}`}
//                         </span>
//                       )}
//                     </div>
//                     <p className="text-4xl font-black mb-2">
//                       ₹ {filteredExpenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0).toLocaleString("en-IN")}
//                     </p>
//                     <p className="text-rose-100 text-sm">
//                       {filteredExpenses.length} {filteredExpenses.length === 1 ? 'expense' : 'expenses'}
//                     </p>
//                   </div>

//                   {/* Filtered Balance (Income - Expense) */}
//                   <div className={`bg-gradient-to-br ${filteredIncomes.reduce((s, i) => s + Number(i.amount || 0), 0) >=
//                       filteredExpenses.reduce((s, e) => s + Number(e.amount || 0), 0)



//                       ? "from-blue-500 to-cyan-600"
//                       : "from-amber-600 to-orange-700"} 


//     } text-white rounded-2xl p-6 shadow-2xl relative overflow-hidden`}
//                   >
//                     <div className="flex justify-between items-start mb-4">
//                       <p className="font-semibold text-base opacity-90">Balance</p>
//                       {(filterMonth || filterYear) && (
//                         <span className="bg-white/20 px-2 py-1 rounded-lg text-xs font-medium">
//                           {filterMonth && `${new Date(2000, filterMonth - 1).toLocaleString('default', { month: 'short' })}`}
//                           {filterYear && ` ${filterYear}`}
//                         </span>
//                       )}
//                     </div>

//                     <p className="text-4xl font-black mb-2">
//                       ₹ {Math.abs(
//                         filteredIncomes.reduce((s, i) => s + Number(i.amount || 0), 0) -
//                         filteredExpenses.reduce((s, e) => s + Number(e.amount || 0), 0)
//                       ).toLocaleString("en-IN")}
//                     </p>

//                     <div className="flex items-center gap-2">
//                       {filteredIncomes.reduce((s, i) => s + Number(i.amount || 0), 0) >=
//                         filteredExpenses.reduce((s, e) => s + Number(e.amount || 0), 0) ? (
//                         <span className="text-green-100 text-sm font-medium">Surplus</span>
//                       ) : (
//                         <span className="text-amber-100 text-sm font-medium">Deficit</span>
//                       )}
//                       <span className="text-white/70 text-xs">
//                         (Income - Expense)
//                       </span>
//                     </div>
//                   </div>

//                   {/* Filtered Total Income */}
//                   <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-2xl p-6 shadow-2xl">
//                     <div className="flex justify-between items-start mb-4">
//                       <p className="text-blue-100 font-semibold text-base">Total Income</p>
//                       {(filterMonth || filterYear) && (
//                         <span className="bg-white/20 px-2 py-1 rounded-lg text-xs font-medium">
//                           {filterMonth && `${new Date(2000, filterMonth - 1).toLocaleString('default', { month: 'short' })}`}
//                           {filterYear && ` ${filterYear}`}
//                         </span>
//                       )}
//                     </div>
//                     <p className="text-4xl font-black mb-2">
//                       ₹ {filteredIncomes.reduce((sum, inc) => sum + Number(inc.amount || 0), 0).toLocaleString("en-IN")}
//                     </p>
//                     <p className="text-blue-100 text-sm">
//                       {filteredIncomes.length} {filteredIncomes.length === 1 ? 'income' : 'incomes'}
//                     </p>
//                   </div>
//                 </div>



//                 {/* Income List */}
//                 <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-200/50 shadow-xl">
//                   <h3 className="text-3xl font-black text-green-700 mb-6 flex items-center justify-between">
//                     Recent Incomes
//                     <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-lg font-bold">
//                       {filteredIncomes.length} {filteredIncomes.length === 1 ? "item" : "items"}
//                     </span>
//                   </h3>
//                   <TransactionList
//                     items={filteredIncomes}
//                     type="income"
//                     onEdit={startEditIncome}
//                     onDelete={deleteIncome}
//                     currentPage={incomePage}
//                     setCurrentPage={setIncomePage}
//                   />
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-12">
//                 {/* Expense Form */}
//                 <div className="bg-gradient-to-br from-rose-50 to-red-100/50 rounded-2xl p-8 border-2 border-rose-200/50 shadow-lg">
//                   <div className="flex items-center justify-between mb-8">
//                     <h3 className="text-3xl font-black text-gray-800">
//                       {editingExpense ? "Edit Expense" : "Add New Expense"}
//                     </h3>
//                     {editingExpense && (
//                       <button
//                         onClick={cancelEdit}
//                         className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all"
//                       >
//                         Cancel
//                       </button>
//                     )}
//                   </div>

//                   {/* Row 1 */}
//                   <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Title *</label>
//                       <input
//                         type="text"
//                         placeholder="Enter title"
//                         value={expenseData.title}
//                         onChange={(e) => setExpenseData({ ...expenseData, title: e.target.value })}
//                         className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-rose-200 focus:border-rose-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
//                       <select
//                         value={expenseData.category}
//                         onChange={(e) => setExpenseData({ ...expenseData, category: e.target.value })}
//                         className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-rose-200 bg-white shadow-sm cursor-pointer"
//                       >
//                         {EXPENSE_CATEGORIES.map((c) => (
//                           <option key={c} value={c}>{c}</option>
//                         ))}
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Amount *</label>
//                       <input
//                         type="number"
//                         placeholder="0.00"
//                         value={expenseData.amount}
//                         onChange={(e) => setExpenseData({ ...expenseData, amount: e.target.value })}
//                         className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-rose-200 focus:border-rose-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Currency</label>
//                       <select
//                         value={expenseData.currency}
//                         onChange={(e) => setExpenseData({ ...expenseData, currency: e.target.value })}
//                         className="cursor-pointer w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-rose-200 bg-white shadow-sm"
//                       >
//                         {CURRENCIES.map((c) => (
//                           <option key={c} value={c}>{c}</option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   {/* Row 2 */}
//                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
//                       <input
//                         type="date"
//                         value={expenseData.date}
//                         onChange={(e) => setExpenseData({ ...expenseData, date: e.target.value })}
//                         className="cursor-pointer w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-rose-200 focus:border-rose-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Payment Method</label>
//                       <select
//                         value={expenseData.paymentMethod}
//                         onChange={(e) => setExpenseData({ ...expenseData, paymentMethod: e.target.value })}
//                         className="cursor-pointer w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-rose-200 bg-white shadow-sm"
//                       >
//                         <option value="cash">Cash</option>
//                         <option value="bank">Bank Transfer</option>
//                         <option value="upi">UPI</option>
//                         <option value="card">Card</option>
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
//                       <textarea
//                         placeholder="Optional notes..."
//                         value={expenseData.description}
//                         onChange={(e) => setExpenseData({ ...expenseData, description: e.target.value })}
//                         rows={1}
//                         className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl resize-none focus:ring-4 focus:ring-rose-200 focus:border-rose-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>
//                   </div>

//                   {/* Save Button */}
//                   <div className="flex justify-end">
//                     <button
//                       onClick={handleExpense}
//                       className="cursor-pointer px-10 py-4 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-bold rounded-xl shadow-2xl transition-all transform hover:scale-105 text-lg"
//                     >
//                       {editingExpense ? "Update Expense" : "Save Expense"}
//                     </button>
//                   </div>
//                 </div>

//               {/* Filtered Summary Cards - Based on Current Filter */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
//                   {/* Filtered Total Expenses */}
//                   <div className="bg-gradient-to-br from-rose-500 to-red-600 text-white rounded-2xl p-6 shadow-2xl relative overflow-hidden">
//                     <div className="flex justify-between items-start mb-4">
//                       <p className="text-rose-100 font-semibold text-base">Total Expenses</p>
//                       {(filterMonth || filterYear) && (
//                         <span className="bg-white/20 px-2 py-1 rounded-lg text-xs font-medium">
//                           {filterMonth && `${new Date(2000, filterMonth - 1).toLocaleString('default', { month: 'short' })}`}
//                           {filterYear && ` ${filterYear}`}
//                         </span>
//                       )}
//                     </div>
//                     <p className="text-4xl font-black mb-2">
//                       ₹ {filteredExpenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0).toLocaleString("en-IN")}
//                     </p>
//                     <p className="text-rose-100 text-sm">
//                       {filteredExpenses.length} {filteredExpenses.length === 1 ? 'expense' : 'expenses'}
//                     </p>
//                   </div>

//                   {/* Filtered Balance (Income - Expense) */}
//                   <div className={`bg-gradient-to-br ${filteredIncomes.reduce((s, i) => s + Number(i.amount || 0), 0) >=
//                       filteredExpenses.reduce((s, e) => s + Number(e.amount || 0), 0)



//                       ? "from-blue-500 to-cyan-600"
//                       : "from-amber-600 to-orange-700"} 


//     } text-white rounded-2xl p-6 shadow-2xl relative overflow-hidden`}
//                   >
//                     <div className="flex justify-between items-start mb-4">
//                       <p className="font-semibold text-base opacity-90">Balance</p>
//                       {(filterMonth || filterYear) && (
//                         <span className="bg-white/20 px-2 py-1 rounded-lg text-xs font-medium">
//                           {filterMonth && `${new Date(2000, filterMonth - 1).toLocaleString('default', { month: 'short' })}`}
//                           {filterYear && ` ${filterYear}`}
//                         </span>
//                       )}
//                     </div>

//                     <p className="text-4xl font-black mb-2">
//                       ₹ {Math.abs(
//                         filteredIncomes.reduce((s, i) => s + Number(i.amount || 0), 0) -
//                         filteredExpenses.reduce((s, e) => s + Number(e.amount || 0), 0)
//                       ).toLocaleString("en-IN")}
//                     </p>

//                     <div className="flex items-center gap-2">
//                       {filteredIncomes.reduce((s, i) => s + Number(i.amount || 0), 0) >=
//                         filteredExpenses.reduce((s, e) => s + Number(e.amount || 0), 0) ? (
//                         <span className="text-green-100 text-sm font-medium">Surplus</span>
//                       ) : (
//                         <span className="text-amber-100 text-sm font-medium">Deficit</span>
//                       )}
//                       <span className="text-white/70 text-xs">
//                         (Income - Expense)
//                       </span>
//                     </div>
//                   </div>

//                   {/* Filtered Total Income */}
//                   <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-2xl p-6 shadow-2xl">
//                     <div className="flex justify-between items-start mb-4">
//                       <p className="text-blue-100 font-semibold text-base">Total Income</p>
//                       {(filterMonth || filterYear) && (
//                         <span className="bg-white/20 px-2 py-1 rounded-lg text-xs font-medium">
//                           {filterMonth && `${new Date(2000, filterMonth - 1).toLocaleString('default', { month: 'short' })}`}
//                           {filterYear && ` ${filterYear}`}
//                         </span>
//                       )}
//                     </div>
//                     <p className="text-4xl font-black mb-2">
//                       ₹ {filteredIncomes.reduce((sum, inc) => sum + Number(inc.amount || 0), 0).toLocaleString("en-IN")}
//                     </p>
//                     <p className="text-blue-100 text-sm">
//                       {filteredIncomes.length} {filteredIncomes.length === 1 ? 'income' : 'incomes'}
//                     </p>
//                   </div>
//                 </div>




//                 {/* Expense List */}
//                 <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-200/50 shadow-xl">
//                   <h3 className="text-3xl font-black text-red-700 mb-6 flex items-center justify-between">
//                     Recent Expenses
//                     <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-lg font-bold">
//                       {filteredExpenses.length} {filteredExpenses.length === 1 ? "item" : "items"}
//                     </span>
//                   </h3>
//                   <TransactionList
//                     items={filteredExpenses}
//                     type="expense"
//                     onEdit={startEditExpense}
//                     onDelete={deleteExpense}
//                     currentPage={expensePage}
//                     setCurrentPage={setExpensePage}
//                   />
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

//=============================all filter data by monthly===========CORRECT FULLY==================


// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../api";
// import TransactionList from "../components/TransactionList";

// export default function ProjectPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [mode, setMode] = useState("income");
//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [liveRates, setLiveRates] = useState({ INR: 1 });
//   const [ratesLoading, setRatesLoading] = useState(true);
//   const [ratesError, setRatesError] = useState(false);

//   const CURRENCIES = ["USD", "AED", "INR", "CAD", "AUD"];
//   const currencySymbols = { USD: "$", AED: "د.إ", INR: "₹", CAD: "C$", AUD: "A$" };

//   const INCOME_CATEGORIES = ["MCO Meta", "MCO PPC", "Meta Rental", "Commission", "Technology Sale", "Domestic Tour Package", "International Tour Package", "Airline Ticket", "Hotel", "Car Hire", "Activities", "Airport Transfers", "Visa", "Others"];
//   const EXPENSE_CATEGORIES = ["Salaries", "Incentives", "Rent", "Travel Allowance Agent", "Travel Allowance Owner", "Meta Recharge", "Chargeback", "Refunds", "Miscellaneous Expenses", "Call Payment", "RDP Payment", "Ticket Issuance Pay", "API Payment", "Website Expenses", "Vonage Payment", "PPC Call Payment", "Campaign Payment", "Others"];

//   const [incomeData, setIncomeData] = useState({ title: "", category: "Others", amount: "", currency: "INR", date: new Date().toISOString().split("T")[0], paymentMethod: "cash", description: "" });
//   const [expenseData, setExpenseData] = useState({ title: "", category: "Others", amount: "", currency: "INR", date: new Date().toISOString().split("T")[0], paymentMethod: "cash", description: "" });

//   const [incomes, setIncomes] = useState([]);
//   const [expenses, setExpenses] = useState([]);
//   const [summary, setSummary] = useState(null);
//   const [editingIncome, setEditingIncome] = useState(null);
//   const [editingExpense, setEditingExpense] = useState(null);
//   const [incomePage, setIncomePage] = useState(1);
//   const [expensePage, setExpensePage] = useState(1);

//   // Current month/year for default filter
//   const today = new Date();
//   const currentMonth = today.getMonth() + 1; // 1-12
//   const currentYear = today.getFullYear();

//   const [filterMonth, setFilterMonth] = useState(currentMonth);
//   const [filterYear, setFilterYear] = useState(currentYear);

//   // Exact same rates as backend
//   const RATES_TO_INR = {
//     USD: 88.5,
//     AED: 24.1,
//     CAD: 63.8,
//     AUD: 58.4,
//     INR: 1,
//   };

//   // Fetch live rates (for display only)
//   useEffect(() => {
//     const fetchLiveRates = async () => {
//       try {
//         setRatesLoading(true);
//         const res = await api.get("/finance/rates");
//         if (res.data.success && res.data.rates) {
//           setLiveRates({
//             INR: 1,
//             USD: res.data.rates.USD || 88.5,
//             AED: res.data.rates.AED || 24.1,
//             CAD: res.data.rates.CAD || 63.8,
//             AUD: res.data.rates.AUD || 58.4,
//           });
//         }
//       } catch (err) {
//         console.error("Live rates failed, using fallback");
//         setRatesError(true);
//         setLiveRates({ USD: 88.5, AED: 24.1, INR: 1, CAD: 63.8, AUD: 58.4 });
//       } finally {
//         setRatesLoading(false);
//       }
//     };
//     fetchLiveRates();
//   }, []);

//   // Load project data
//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);
//       try {
//         const [proj, inc, exp, sum] = await Promise.all([
//           api.get(`/projects/${id}`),
//           api.get(`/finance/incomes?project=${id}`),
//           api.get(`/finance/expenses?project=${id}`),
//           api.get(`/finance/summary?project=${id}`).catch(() => ({ data: { success: false } })),
//         ]);

//         if (proj.data.success) setProject(proj.data.project);
//         setIncomes(inc.data.incomes || []);
//         setExpenses(exp.data.expenses || []);
//         if (sum.data.success) setSummary(sum.data.summary);
//       } catch (err) {
//         console.error("Load failed:", err);
//         alert("Failed to load project data");
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (id) load();
//   }, [id]);

//   const refreshData = async () => {
//     try {
//       const [inc, exp, sum] = await Promise.all([
//         api.get(`/finance/incomes?project=${id}`),
//         api.get(`/finance/expenses?project=${id}`),
//         api.get(`/finance/summary?project=${id}`).catch(() => ({ data: {} })),
//       ]);
//       setIncomes(inc.data.incomes || []);
//       setExpenses(exp.data.expenses || []);
//       if (sum.data.success) setSummary(sum.data.summary);
//     } catch (err) {
//       console.error("Refresh failed");
//     }
//   };

//   // Form handlers
//   const handleIncome = async () => {
//     if (!incomeData.title || !incomeData.amount) return alert("Title & Amount required");
//     const payload = { ...incomeData, amount: Number(incomeData.amount), project: id };
//     try {
//       editingIncome
//         ? await api.put(`/finance/income/${editingIncome._id}`, payload)
//         : await api.post("/finance/income", payload);
//       setEditingIncome(null);
//       resetIncomeForm();
//       refreshData();
//     } catch (err) { alert("Save failed"); }
//   };

//   const handleExpense = async () => {
//     if (!expenseData.title || !expenseData.amount) return alert("Title & Amount required");
//     const payload = { ...expenseData, amount: Number(expenseData.amount), project: id };
//     try {
//       editingExpense
//         ? await api.put(`/finance/expense/${editingExpense._id}`, payload)
//         : await api.post("/finance/expense", payload);
//       setEditingExpense(null);
//       resetExpenseForm();
//       refreshData();
//     } catch (err) { alert("Save failed"); }
//   };

//   const resetIncomeForm = () => setIncomeData({ title: "", category: "Others", amount: "", currency: "INR", date: new Date().toISOString().split("T")[0], paymentMethod: "cash", description: "" });
//   const resetExpenseForm = () => setExpenseData({ title: "", category: "Others", amount: "", currency: "INR", date: new Date().toISOString().split("T")[0], paymentMethod: "cash", description: "" });

//   const startEditIncome = (i) => {
//     setEditingIncome(i);
//     setIncomeData({ title: i.title, category: i.category, amount: i.amount, currency: i.currency, date: i.date.split("T")[0], paymentMethod: i.paymentMethod || "cash", description: i.description || "" });
//   };

//   const startEditExpense = (e) => {
//     setEditingExpense(e);
//     setExpenseData({ title: e.title, category: e.category, amount: e.amount, currency: e.currency, date: e.date.split("T")[0], paymentMethod: e.paymentMethod || "cash", description: e.description || "" });
//   };

//   const cancelEdit = () => {
//     setEditingIncome(null);
//     setEditingExpense(null);
//     resetIncomeForm();
//     resetExpenseForm();
//   };

//   const deleteIncome = async (id) => { if (confirm("Delete this income?")) { await api.delete(`/finance/income/${id}`); refreshData(); } };
//   const deleteExpense = async (id) => { if (confirm("Delete this expense?")) { await api.delete(`/finance/expense/${id}`); refreshData(); } };

//   // Filtering
//   const applyFilter = (items) => {
//     return items.filter((item) => {
//       if (!filterMonth && !filterYear) return true;
//       const date = new Date(item.date);
//       const month = date.getMonth() + 1;
//       const year = date.getFullYear();
//       const monthMatch = filterMonth ? month === Number(filterMonth) : true;
//       const yearMatch = filterYear ? year === Number(filterYear) : true;
//       return monthMatch && yearMatch;
//     });
//   };

//   const filteredIncomes = applyFilter(incomes);
//   const filteredExpenses = applyFilter(expenses);

//   // Filtered Summary (Same logic as backend)
//   const getFilteredSummary = () => {
//     const totalIncomeINR = filteredIncomes.reduce((sum, inc) => {
//       const amount = Number(inc.amount) || 0;
//       const currency = inc.currency || "INR";
//       const rate = RATES_TO_INR[currency] || 1;
//       return sum + amount * rate;
//     }, 0);

//     const totalExpenseINR = filteredExpenses.reduce((sum, exp) => {
//       const amount = Number(exp.amount) || 0;
//       const currency = exp.currency || "INR";
//       const rate = RATES_TO_INR[currency] || 1;
//       return sum + amount * rate;
//     }, 0);

//     const balanceINR = totalIncomeINR - totalExpenseINR;

//     return {
//       totalIncomeINR: Math.round(totalIncomeINR),
//       totalExpenseINR: Math.round(totalExpenseINR),
//       balanceINR: Math.round(balanceINR),
//     };
//   };

//   const downloadReport = async () => {
//     try {
//       const res = await api.get(`/finance/download?project=${id}`, { responseType: "blob" });
//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `${project?.name || "Project"}-Report.xlsx`;
//       a.click();
//     } catch (err) { alert("Download failed"); }
//   };

//   if (loading) return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center"><div className="animate-spin h-12 w-12 border-4 border-blue-600 rounded-full border-t-transparent"></div></div>;
//   if (!project) return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-red-600 text-xl">Project not found</div>;

//   const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//   const isFiltered = filterMonth || filterYear;
//   const displayLabel = isFiltered
//     ? `${filterMonth ? monthNames[Number(filterMonth) - 1] : ""} ${filterYear || ""}`.trim() || "Filtered"
//     : "All Time";

//   const displayedSummary = isFiltered
//     ? getFilteredSummary()
//     : {
//       totalIncomeINR: Math.round(summary?.totalIncomeINR || 0),
//       totalExpenseINR: Math.round(summary?.totalExpenseINR || 0),
//       balanceINR: Math.round(summary?.balanceINR || 0),
//     };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-2xl sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
//           <div className="flex items-center gap-6">
//             <button onClick={() => navigate("/dashboard")} className="cursor-pointer px-6 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-all flex items-center gap-2">
//               Back to Projects
//             </button>
//             <div className="text-white">
//               <h1 className="text-4xl font-bold">{project.name}</h1>
//               <p className="text-blue-100 mt-2 text-lg">{project.description || "No description"}</p>
//             </div>
//           </div>
//           <button onClick={downloadReport} className="cursor-pointer px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-xl shadow-2xl transition-all flex items-center gap-3">
//             Download Excel Report
//           </button>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-10">


//         {/* Summary Cards  --- SUMMARY 1  */}
    
//         {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">

//           <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-2xl p-8 shadow-2xl">
//             <p className="text-emerald-100 font-semibold text-lg">Total Income</p>
//             <p className="text-5xl font-black mt-4">₹ {(summary.totalIncomeINR || 0).toLocaleString("en-IN")}</p>
//           </div>


//           <div className="bg-gradient-to-br from-rose-500 to-red-600 text-white rounded-2xl p-8 shadow-2xl">
//             <p className="text-rose-100 font-semibold text-lg">Total Expenses</p>
//             <p className="text-5xl font-black mt-4">₹ {(summary.totalExpenseINR || 0).toLocaleString("en-IN")}</p>
//           </div>


//           <div className={`bg-gradient-to-br ${summary.balanceINR >= 0 ? "from-blue-500 to-cyan-600" : "from-amber-500 to-orange-600"} text-white rounded-2xl p-8 shadow-2xl`}>
//             <p className="text-blue-100 font-semibold text-lg">Balance</p>
//             <p className="text-5xl font-black mt-4">
//               ₹ {Math.abs(summary.balanceINR || 0).toLocaleString("en-IN")}
//               {summary.balanceINR < 0 && <span className="text-lg block mt-2">(Deficit)</span>}
//             </p>
//           </div>
//         </div> */}

//         {/* MAIN SUMMARY CARDS - Auto Current Month---- SUMMARY 2 */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
//           {/* Total Income */}
//           <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden">
//             <p className="text-emerald-100 font-semibold text-lg">
//               Total Income
//             </p>
//             <p className="text-5xl font-black mt-4">
//               ₹ {displayedSummary.totalIncomeINR.toLocaleString("en-IN")}
//             </p>
//             {isFiltered && (
//               <span className="absolute top-3 right-3 bg-white/30 px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm">
//                 {displayLabel}
//               </span>
//             )}
//           </div>

//           {/* Total Expenses */}
//           <div className="bg-gradient-to-br from-rose-500 to-red-600 text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden">
//             <p className="text-rose-100 font-semibold text-lg">
//               Total Expenses
//             </p>
//             <p className="text-5xl font-black mt-4">
//               ₹ {displayedSummary.totalExpenseINR.toLocaleString("en-IN")}
//             </p>
//             {isFiltered && (
//               <span className="absolute top-3 right-3 bg-white/30 px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm">
//                 {displayLabel}
//               </span>
//             )}
//           </div>

//           {/* Balance */}
//           <div className={`bg-gradient-to-br ${displayedSummary.balanceINR >= 0 ? "from-blue-500 to-cyan-600" : "from-amber-500 to-orange-600"} text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden`}>
//             <p className="text-blue-100 font-semibold text-lg">
//               {/* Balance (Income - Expense) {isFiltered && <span className="opacity-90">({displayLabel})</span>} */}
//               Balance (Income - Expense)

//             </p>
//             <p className="text-5xl font-black mt-4">
//               ₹ {Math.abs(displayedSummary.balanceINR).toLocaleString("en-IN")}
//               {displayedSummary.balanceINR < 0 && <span className="text-lg block mt-2 font-medium">(Deficit)</span>}
//             </p>
//             {isFiltered && (
//               <span className="absolute top-3 right-3 bg-white/30 px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm">
//                 {displayLabel}
//               </span>
//             )}
//           </div>
//         </div>

//         {/* Filter Bar */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex flex-wrap items-end gap-4">
//           <div className="flex-1 min-w-[200px]">
//             <label className="block text-gray-700 font-bold mb-2">Filter by Month</label>
//             <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="cursor-pointer w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500">
//               <option value="">All Months</option>
//               {monthNames.map((m, i) => (
//                 <option key={i + 1} value={i + 1}>{m}</option>
//               ))}
//             </select>
//           </div>

//           <div className="flex-1 min-w-[200px]">
//             <label className="block text-gray-700 font-bold mb-2">Filter by Year</label>
//             <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="cursor-pointer w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500">
//               <option value="">All Years</option>
//               {[2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030].map(year => (
//                 <option key={year} value={year}>{year}</option>
//               ))}
//             </select>
//           </div>

//           <button onClick={() => { setFilterMonth(currentMonth); setFilterYear(currentYear); }} className="cursor-pointer px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all">
//             Current Month
//           </button>

//           <button onClick={() => { setFilterMonth(""); setFilterYear(""); }} className="cursor-pointer px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-xl transition-all">
//             All Time
//           </button>
//         </div>

//         {/* Rest of your tabs, forms, and lists (unchanged) */}
//         <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
//           {/* Tabs */}
//           <div className="flex border-b bg-gradient-to-r from-gray-50 to-blue-50/50">
//             <button onClick={() => { setMode("income"); cancelEdit(); }} className={`cursor-pointer flex-1 py-6 text-xl font-black transition-all relative ${mode === "income" ? "text-blue-700 bg-white shadow-lg" : "text-gray-500 hover:text-gray-800"}`}>
//               {editingIncome ? "Edit Income" : "Add Income"}
//               {mode === "income" && <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>}
//             </button>
//             <button onClick={() => { setMode("expense"); cancelEdit(); }} className={`cursor-pointer flex-1 py-6 text-xl font-black transition-all relative ${mode === "expense" ? "text-blue-700 bg-white shadow-lg" : "text-gray-500 hover:text-gray-800"}`}>
//               {editingExpense ? "Edit Expense" : "Add Expense"}
//               {mode === "expense" && <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>}
//             </button>
//           </div>

//           <div className="p-10">

//             {mode === "income" ? (
//               <div className="space-y-12">
//                 {/* Income Form */}
//                 <div className="bg-gradient-to-br from-green-50 to-emerald-100/50 rounded-2xl p-8 border-2 border-emerald-200/50 shadow-lg">
//                   <div className="flex items-center justify-between mb-8">
//                     <h3 className="text-3xl font-black text-gray-800">
//                       {editingIncome ? "Edit Income" : "Add New Income"}
//                     </h3>
//                     {editingIncome && (
//                       <button
//                         onClick={cancelEdit}
//                         className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all"
//                       >
//                         Cancel
//                       </button>
//                     )}
//                   </div>

//                   {/* Row 1: Title, Category, Amount, Currency */}
//                   <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Title *</label>
//                       <input
//                         type="text"
//                         placeholder="Enter title"
//                         value={incomeData.title}
//                         onChange={(e) => setIncomeData({ ...incomeData, title: e.target.value })}
//                         className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
//                       <select
//                         value={incomeData.category}
//                         onChange={(e) => setIncomeData({ ...incomeData, category: e.target.value })}
//                         className="cursor-pointer w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 bg-white shadow-sm"
//                       >
//                         {INCOME_CATEGORIES.map((c) => (
//                           <option key={c} value={c}>{c}</option>
//                         ))}
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Amount *</label>
//                       <input
//                         type="number"
//                         placeholder="0.00"
//                         value={incomeData.amount}
//                         onChange={(e) => setIncomeData({ ...incomeData, amount: e.target.value })}
//                         className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Currency</label>
//                       <select
//                         value={incomeData.currency}
//                         onChange={(e) => setIncomeData({ ...incomeData, currency: e.target.value })}
//                         className="cursor-pointer w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 bg-white shadow-sm"
//                       >
//                         {CURRENCIES.map((c) => (
//                           <option key={c} value={c}>{c}</option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   {/* Row 2: Date, Payment Method, Description */}
//                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
//                       <input
//                         type="date"
//                         value={incomeData.date}
//                         onChange={(e) => setIncomeData({ ...incomeData, date: e.target.value })}
//                         className="cursor-pointer w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Payment Method</label>
//                       <select
//                         value={incomeData.paymentMethod}
//                         onChange={(e) => setIncomeData({ ...incomeData, paymentMethod: e.target.value })}
//                         className="cursor-pointer w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 bg-white shadow-sm"
//                       >
//                         <option value="cash">Cash</option>
//                         <option value="bank">Bank Transfer</option>
//                         <option value="upi">UPI</option>
//                         <option value="card">Card</option>
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
//                       <textarea
//                         placeholder="Optional notes..."
//                         value={incomeData.description}
//                         onChange={(e) => setIncomeData({ ...incomeData, description: e.target.value })}
//                         rows={1}
//                         className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl resize-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>
//                   </div>

//                   {/* Save Button */}
//                   <div className="flex justify-end">
//                     <button
//                       onClick={handleIncome}
//                       className="cursor-pointer px-10 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-xl shadow-2xl transition-all transform hover:scale-105 text-lg"
//                     >
//                       {editingIncome ? "Update Income" : "Save Income"}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Income List */}
//                 <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-200/50 shadow-xl">
//                   <h3 className="text-3xl font-black text-green-700 mb-6 flex items-center justify-between">
//                     Recent Incomes
//                     <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-lg font-bold">
//                       {filteredIncomes.length} {filteredIncomes.length === 1 ? "item" : "items"}
//                     </span>
//                   </h3>
//                   <TransactionList
//                     items={filteredIncomes}
//                     type="income"
//                     onEdit={startEditIncome}
//                     onDelete={deleteIncome}
//                     currentPage={incomePage}
//                     setCurrentPage={setIncomePage}
//                   />
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-12">
//                 {/* Expense Form */}
//                 <div className="bg-gradient-to-br from-rose-50 to-red-100/50 rounded-2xl p-8 border-2 border-rose-200/50 shadow-lg">
//                   <div className="flex items-center justify-between mb-8">
//                     <h3 className="text-3xl font-black text-gray-800">
//                       {editingExpense ? "Edit Expense" : "Add New Expense"}
//                     </h3>
//                     {editingExpense && (
//                       <button
//                         onClick={cancelEdit}
//                         className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all"
//                       >
//                         Cancel
//                       </button>
//                     )}
//                   </div>

//                   {/* Row 1 */}
//                   <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Title *</label>
//                       <input
//                         type="text"
//                         placeholder="Enter title"
//                         value={expenseData.title}
//                         onChange={(e) => setExpenseData({ ...expenseData, title: e.target.value })}
//                         className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-rose-200 focus:border-rose-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
//                       <select
//                         value={expenseData.category}
//                         onChange={(e) => setExpenseData({ ...expenseData, category: e.target.value })}
//                         className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-rose-200 bg-white shadow-sm cursor-pointer"
//                       >
//                         {EXPENSE_CATEGORIES.map((c) => (
//                           <option key={c} value={c}>{c}</option>
//                         ))}
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Amount *</label>
//                       <input
//                         type="number"
//                         placeholder="0.00"
//                         value={expenseData.amount}
//                         onChange={(e) => setExpenseData({ ...expenseData, amount: e.target.value })}
//                         className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-rose-200 focus:border-rose-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Currency</label>
//                       <select
//                         value={expenseData.currency}
//                         onChange={(e) => setExpenseData({ ...expenseData, currency: e.target.value })}
//                         className="cursor-pointer w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-rose-200 bg-white shadow-sm"
//                       >
//                         {CURRENCIES.map((c) => (
//                           <option key={c} value={c}>{c}</option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   {/* Row 2 */}
//                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
//                       <input
//                         type="date"
//                         value={expenseData.date}
//                         onChange={(e) => setExpenseData({ ...expenseData, date: e.target.value })}
//                         className="cursor-pointer w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-rose-200 focus:border-rose-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Payment Method</label>
//                       <select
//                         value={expenseData.paymentMethod}
//                         onChange={(e) => setExpenseData({ ...expenseData, paymentMethod: e.target.value })}
//                         className="cursor-pointer w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-rose-200 bg-white shadow-sm"
//                       >
//                         <option value="cash">Cash</option>
//                         <option value="bank">Bank Transfer</option>
//                         <option value="upi">UPI</option>
//                         <option value="card">Card</option>
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
//                       <textarea
//                         placeholder="Optional notes..."
//                         value={expenseData.description}
//                         onChange={(e) => setExpenseData({ ...expenseData, description: e.target.value })}
//                         rows={1}
//                         className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl resize-none focus:ring-4 focus:ring-rose-200 focus:border-rose-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>
//                   </div>

//                   {/* Save Button */}
//                   <div className="flex justify-end">
//                     <button
//                       onClick={handleExpense}
//                       className="cursor-pointer px-10 py-4 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-bold rounded-xl shadow-2xl transition-all transform hover:scale-105 text-lg"
//                     >
//                       {editingExpense ? "Update Expense" : "Save Expense"}
//                     </button>
//                   </div>
//                 </div>
//                 {/* Expense List */}
//                 <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-200/50 shadow-xl">
//                   <h3 className="text-3xl font-black text-red-700 mb-6 flex items-center justify-between">
//                     Recent Expenses
//                     <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-lg font-bold">
//                       {filteredExpenses.length} {filteredExpenses.length === 1 ? "item" : "items"}
//                     </span>
//                   </h3>
//                   <TransactionList
//                     items={filteredExpenses}
//                     type="expense"
//                     onEdit={startEditExpense}
//                     onDelete={deleteExpense}
//                     currentPage={expensePage}
//                     setCurrentPage={setExpensePage}
//                   />
//                 </div>
//               </div>
//             )}





//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

//============new===filter wise data download FULL CORRECT=================


// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../api";
// import TransactionList from "../components/TransactionList";

// export default function ProjectPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [mode, setMode] = useState("income");
//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [liveRates, setLiveRates] = useState({ INR: 1 });
//   const [ratesLoading, setRatesLoading] = useState(true);
//   const [ratesError, setRatesError] = useState(false);

//   const CURRENCIES = ["USD", "AED", "INR", "CAD", "AUD"];
//   const currencySymbols = { USD: "$", AED: "د.إ", INR: "₹", CAD: "C$", AUD: "A$" };

//   const INCOME_CATEGORIES = ["MCO Meta", "MCO PPC", "Meta Rental", "Commission", "Technology Sale", "Domestic Tour Package", "International Tour Package", "Airline Ticket", "Hotel", "Car Hire", "Activities", "Airport Transfers", "Visa", "Others"];
//   const EXPENSE_CATEGORIES = ["Salaries", "Incentives", "Rent", "Travel Allowance Agent", "Travel Allowance Owner", "Meta Recharge", "Chargeback", "Refunds", "Miscellaneous Expenses", "Call Payment", "RDP Payment", "Ticket Issuance Pay", "API Payment", "Website Expenses", "Vonage Payment", "PPC Call Payment", "Campaign Payment", "Others"];

//   const [incomeData, setIncomeData] = useState({ title: "", category: "Others", amount: "", currency: "INR", date: new Date().toISOString().split("T")[0], paymentMethod: "cash", description: "" });
//   const [expenseData, setExpenseData] = useState({ title: "", category: "Others", amount: "", currency: "INR", date: new Date().toISOString().split("T")[0], paymentMethod: "cash", description: "" });

//   const [incomes, setIncomes] = useState([]);
//   const [expenses, setExpenses] = useState([]);
//   const [summary, setSummary] = useState(null);
//   const [editingIncome, setEditingIncome] = useState(null);
//   const [editingExpense, setEditingExpense] = useState(null);
//   const [incomePage, setIncomePage] = useState(1);
//   const [expensePage, setExpensePage] = useState(1);

//   // Current month/year for default filter
//   const today = new Date();
//   const currentMonth = today.getMonth() + 1; // 1-12
//   const currentYear = today.getFullYear();

//   const [filterMonth, setFilterMonth] = useState(currentMonth);
//   const [filterYear, setFilterYear] = useState(currentYear);

//   // Exact same rates as backend
//   const RATES_TO_INR = {
//     USD: 88.5,
//     AED: 24.1,
//     CAD: 63.8,
//     AUD: 58.4,
//     INR: 1,
//   };

//   // Fetch live rates (for display only)
//   useEffect(() => {
//     const fetchLiveRates = async () => {
//       try {
//         setRatesLoading(true);
//         const res = await api.get("/finance/rates");
//         if (res.data.success && res.data.rates) {
//           setLiveRates({
//             INR: 1,
//             USD: res.data.rates.USD || 88.5,
//             AED: res.data.rates.AED || 24.1,
//             CAD: res.data.rates.CAD || 63.8,
//             AUD: res.data.rates.AUD || 58.4,
//           });
//         }
//       } catch (err) {
//         console.error("Live rates failed, using fallback");
//         setRatesError(true);
//         setLiveRates({ USD: 88.5, AED: 24.1, INR: 1, CAD: 63.8, AUD: 58.4 });
//       } finally {
//         setRatesLoading(false);
//       }
//     };
//     fetchLiveRates();
//   }, []);

//   // Load project data
//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);
//       try {
//         const [proj, inc, exp, sum] = await Promise.all([
//           api.get(`/projects/${id}`),
//           api.get(`/finance/incomes?project=${id}`),
//           api.get(`/finance/expenses?project=${id}`),
//           api.get(`/finance/summary?project=${id}`).catch(() => ({ data: { success: false } })),
//         ]);

//         if (proj.data.success) setProject(proj.data.project);
//         setIncomes(inc.data.incomes || []);
//         setExpenses(exp.data.expenses || []);
//         if (sum.data.success) setSummary(sum.data.summary);
//       } catch (err) {
//         console.error("Load failed:", err);
//         alert("Failed to load project data");
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (id) load();
//   }, [id]);

//   const refreshData = async () => {
//     try {
//       const [inc, exp, sum] = await Promise.all([
//         api.get(`/finance/incomes?project=${id}`),
//         api.get(`/finance/expenses?project=${id}`),
//         api.get(`/finance/summary?project=${id}`).catch(() => ({ data: {} })),
//       ]);
//       setIncomes(inc.data.incomes || []);
//       setExpenses(exp.data.expenses || []);
//       if (sum.data.success) setSummary(sum.data.summary);
//     } catch (err) {
//       console.error("Refresh failed");
//     }
//   };

//   // Form handlers
//   const handleIncome = async () => {
//     if (!incomeData.title || !incomeData.amount) return alert("Title & Amount required");
//     const payload = { ...incomeData, amount: Number(incomeData.amount), project: id };
//     try {
//       editingIncome
//         ? await api.put(`/finance/income/${editingIncome._id}`, payload)
//         : await api.post("/finance/income", payload);
//       setEditingIncome(null);
//       resetIncomeForm();
//       refreshData();
//     } catch (err) { alert("Save failed"); }
//   };

//   const handleExpense = async () => {
//     if (!expenseData.title || !expenseData.amount) return alert("Title & Amount required");
//     const payload = { ...expenseData, amount: Number(expenseData.amount), project: id };
//     try {
//       editingExpense
//         ? await api.put(`/finance/expense/${editingExpense._id}`, payload)
//         : await api.post("/finance/expense", payload);
//       setEditingExpense(null);
//       resetExpenseForm();
//       refreshData();
//     } catch (err) { alert("Save failed"); }
//   };

//   const resetIncomeForm = () => setIncomeData({ title: "", category: "Others", amount: "", currency: "INR", date: new Date().toISOString().split("T")[0], paymentMethod: "cash", description: "" });
//   const resetExpenseForm = () => setExpenseData({ title: "", category: "Others", amount: "", currency: "INR", date: new Date().toISOString().split("T")[0], paymentMethod: "cash", description: "" });

//   const startEditIncome = (i) => {
//     setEditingIncome(i);
//     setIncomeData({ title: i.title, category: i.category, amount: i.amount, currency: i.currency, date: i.date.split("T")[0], paymentMethod: i.paymentMethod || "cash", description: i.description || "" });
//   };

//   const startEditExpense = (e) => {
//     setEditingExpense(e);
//     setExpenseData({ title: e.title, category: e.category, amount: e.amount, currency: e.currency, date: e.date.split("T")[0], paymentMethod: e.paymentMethod || "cash", description: e.description || "" });
//   };

//   const cancelEdit = () => {
//     setEditingIncome(null);
//     setEditingExpense(null);
//     resetIncomeForm();
//     resetExpenseForm();
//   };

//   const deleteIncome = async (id) => { if (confirm("Delete this income?")) { await api.delete(`/finance/income/${id}`); refreshData(); } };
//   const deleteExpense = async (id) => { if (confirm("Delete this expense?")) { await api.delete(`/finance/expense/${id}`); refreshData(); } };

//   // Filtering
//   const applyFilter = (items) => {
//     return items.filter((item) => {
//       if (!filterMonth && !filterYear) return true;
//       const date = new Date(item.date);
//       const month = date.getMonth() + 1;
//       const year = date.getFullYear();
//       const monthMatch = filterMonth ? month === Number(filterMonth) : true;
//       const yearMatch = filterYear ? year === Number(filterYear) : true;
//       return monthMatch && yearMatch;
//     });
//   };

//   const filteredIncomes = applyFilter(incomes);
//   const filteredExpenses = applyFilter(expenses);

//   // Filtered Summary (Same logic as backend)
//   const getFilteredSummary = () => {
//     const totalIncomeINR = filteredIncomes.reduce((sum, inc) => {
//       const amount = Number(inc.amount) || 0;
//       const currency = inc.currency || "INR";
//       const rate = RATES_TO_INR[currency] || 1;
//       return sum + amount * rate;
//     }, 0);

//     const totalExpenseINR = filteredExpenses.reduce((sum, exp) => {
//       const amount = Number(exp.amount) || 0;
//       const currency = exp.currency || "INR";
//       const rate = RATES_TO_INR[currency] || 1;
//       return sum + amount * rate;
//     }, 0);

//     const balanceINR = totalIncomeINR - totalExpenseINR;

//     return {
//       totalIncomeINR: Math.round(totalIncomeINR),
//       totalExpenseINR: Math.round(totalExpenseINR),
//       balanceINR: Math.round(balanceINR),
//     };
//   };

//   // const downloadReport = async () => {
//   //   try {
//   //     const res = await api.get(`/finance/download?project=${id}`, { responseType: "blob" });
//   //     const url = window.URL.createObjectURL(new Blob([res.data]));
//   //     const a = document.createElement("a");
//   //     a.href = url;
//   //     a.download = `${project?.name || "Project"}-Report.xlsx`;
//   //     a.click();
//   //   } catch (err) { alert("Download failed"); }
//   // };


//   const downloadReport = async () => {
//   try {
//     // Build query params with filters
//     const params = new URLSearchParams();
//     params.append("project", id);
    
//     if (filterMonth) params.append("month", filterMonth);
//     if (filterYear) params.append("year", filterYear);

//     const res = await api.get(`/finance/download?${params.toString()}`, {
//       responseType: "blob",
//     });

//     const url = window.URL.createObjectURL(new Blob([res.data]));
//     const a = document.createElement("a");
//     a.href = url;

//     // Smart filename with filter
//     const filterText = filterMonth || filterYear
//       ? `${filterMonth ? monthNames[Number(filterMonth) - 1] : ""}_${filterYear || ""}`.trim().replace(" ", "_")
//       : "All_Time";

//     a.download = `${project?.name || "Project"}_Report_${filterText}.xlsx`;
//     a.click();
//     window.URL.revokeObjectURL(url);
//   } catch (err) {
//     console.error("Download failed:", err);
//     alert("Failed to download report");
//   }
// };

//   if (loading) return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center"><div className="animate-spin h-12 w-12 border-4 border-blue-600 rounded-full border-t-transparent"></div></div>;
//   if (!project) return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-red-600 text-xl">Project not found</div>;

//   const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//   const isFiltered = filterMonth || filterYear;
//   const displayLabel = isFiltered
//     ? `${filterMonth ? monthNames[Number(filterMonth) - 1] : ""} ${filterYear || ""}`.trim() || "Filtered"
//     : "All Time";

//   const displayedSummary = isFiltered
//     ? getFilteredSummary()
//     : {
//       totalIncomeINR: Math.round(summary?.totalIncomeINR || 0),
//       totalExpenseINR: Math.round(summary?.totalExpenseINR || 0),
//       balanceINR: Math.round(summary?.balanceINR || 0),
//     };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-2xl sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
//           <div className="flex items-center gap-6">
//             <button onClick={() => navigate("/dashboard")} className="cursor-pointer px-6 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-all flex items-center gap-2">
//               Back to Projects
//             </button>
//             <div className="text-white">
//               <h1 className="text-4xl font-bold">{project.name}</h1>
//               <p className="text-blue-100 mt-2 text-lg">{project.description || "No description"}</p>
//             </div>
//           </div>
//           <button onClick={downloadReport} className="cursor-pointer px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-xl shadow-2xl transition-all flex items-center gap-3">
//             Download Excel Report
//           </button>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-10">


//         {/* Summary Cards  --- SUMMARY 1  */}
    
//         {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">

//           <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-2xl p-8 shadow-2xl">
//             <p className="text-emerald-100 font-semibold text-lg">Total Income</p>
//             <p className="text-5xl font-black mt-4">₹ {(summary.totalIncomeINR || 0).toLocaleString("en-IN")}</p>
//           </div>


//           <div className="bg-gradient-to-br from-rose-500 to-red-600 text-white rounded-2xl p-8 shadow-2xl">
//             <p className="text-rose-100 font-semibold text-lg">Total Expenses</p>
//             <p className="text-5xl font-black mt-4">₹ {(summary.totalExpenseINR || 0).toLocaleString("en-IN")}</p>
//           </div>


//           <div className={`bg-gradient-to-br ${summary.balanceINR >= 0 ? "from-blue-500 to-cyan-600" : "from-amber-500 to-orange-600"} text-white rounded-2xl p-8 shadow-2xl`}>
//             <p className="text-blue-100 font-semibold text-lg">Balance</p>
//             <p className="text-5xl font-black mt-4">
//               ₹ {Math.abs(summary.balanceINR || 0).toLocaleString("en-IN")}
//               {summary.balanceINR < 0 && <span className="text-lg block mt-2">(Deficit)</span>}
//             </p>
//           </div>
//         </div> */}

//         {/* MAIN SUMMARY CARDS - Auto Current Month---- SUMMARY 2 */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
//           {/* Total Income */}
//           <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden">
//             <p className="text-emerald-100 font-semibold text-lg">
//               Total Income
//             </p>
//             <p className="text-5xl font-black mt-4">
//               ₹ {displayedSummary.totalIncomeINR.toLocaleString("en-IN")}
//             </p>
//             {isFiltered && (
//               <span className="absolute top-3 right-3 bg-white/30 px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm">
//                 {displayLabel}
//               </span>
//             )}
//           </div>

//           {/* Total Expenses */}
//           <div className="bg-gradient-to-br from-rose-500 to-red-600 text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden">
//             <p className="text-rose-100 font-semibold text-lg">
//               Total Expenses
//             </p>
//             <p className="text-5xl font-black mt-4">
//               ₹ {displayedSummary.totalExpenseINR.toLocaleString("en-IN")}
//             </p>
//             {isFiltered && (
//               <span className="absolute top-3 right-3 bg-white/30 px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm">
//                 {displayLabel}
//               </span>
//             )}
//           </div>

//           {/* Balance */}
//           <div className={`bg-gradient-to-br ${displayedSummary.balanceINR >= 0 ? "from-blue-500 to-cyan-600" : "from-amber-500 to-orange-600"} text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden`}>
//             <p className="text-blue-100 font-semibold text-lg">
//               {/* Balance (Income - Expense) {isFiltered && <span className="opacity-90">({displayLabel})</span>} */}
//               Balance (Income - Expense)

//             </p>
//             <p className="text-5xl font-black mt-4">
//               ₹ {Math.abs(displayedSummary.balanceINR).toLocaleString("en-IN")}
//               {displayedSummary.balanceINR < 0 && <span className="text-lg block mt-2 font-medium">(Deficit)</span>}
//             </p>
//             {isFiltered && (
//               <span className="absolute top-3 right-3 bg-white/30 px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm">
//                 {displayLabel}
//               </span>
//             )}
//           </div>
//         </div>

//         {/* Filter Bar */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex flex-wrap items-end gap-4">
//           <div className="flex-1 min-w-[200px]">
//             <label className="block text-gray-700 font-bold mb-2">Filter by Month</label>
//             <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="cursor-pointer w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500">
//               <option value="">All Months</option>
//               {monthNames.map((m, i) => (
//                 <option key={i + 1} value={i + 1}>{m}</option>
//               ))}
//             </select>
//           </div>

//           <div className="flex-1 min-w-[200px]">
//             <label className="block text-gray-700 font-bold mb-2">Filter by Year</label>
//             <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="cursor-pointer w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500">
//               <option value="">All Years</option>
//               {[2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031,2032,2033,2034].map(year => (
//                 <option key={year} value={year}>{year}</option>
//               ))}
//             </select>
//           </div>

//           <button onClick={() => { setFilterMonth(currentMonth); setFilterYear(currentYear); }} className="cursor-pointer px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all">
//             Current Month
//           </button>

//           <button onClick={() => { setFilterMonth(""); setFilterYear(""); }} className="cursor-pointer px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-xl transition-all">
//             All Time
//           </button>
//         </div>

//         {/* Rest of your tabs, forms, and lists (unchanged) */}
//         <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
//           {/* Tabs */}
//           <div className="flex border-b bg-gradient-to-r from-gray-50 to-blue-50/50">
//             <button onClick={() => { setMode("income"); cancelEdit(); }} className={`cursor-pointer flex-1 py-6 text-xl font-black transition-all relative ${mode === "income" ? "text-blue-700 bg-white shadow-lg" : "text-gray-500 hover:text-gray-800"}`}>
//               {editingIncome ? "Edit Income" : "Add Income"}
//               {mode === "income" && <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>}
//             </button>
//             <button onClick={() => { setMode("expense"); cancelEdit(); }} className={`cursor-pointer flex-1 py-6 text-xl font-black transition-all relative ${mode === "expense" ? "text-blue-700 bg-white shadow-lg" : "text-gray-500 hover:text-gray-800"}`}>
//               {editingExpense ? "Edit Expense" : "Add Expense"}
//               {mode === "expense" && <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>}
//             </button>
//           </div>

//           <div className="p-10">

//             {mode === "income" ? (
//               <div className="space-y-12">
//                 {/* Income Form */}
//                 <div className="bg-gradient-to-br from-green-50 to-emerald-100/50 rounded-2xl p-8 border-2 border-emerald-200/50 shadow-lg">
//                   <div className="flex items-center justify-between mb-8">
//                     <h3 className="text-3xl font-black text-gray-800">
//                       {editingIncome ? "Edit Income" : "Add New Income"}
//                     </h3>
//                     {editingIncome && (
//                       <button
//                         onClick={cancelEdit}
//                         className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all"
//                       >
//                         Cancel
//                       </button>
//                     )}
//                   </div>

//                   {/* Row 1: Title, Category, Amount, Currency */}
//                   <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Title *</label>
//                       <input
//                         type="text"
//                         placeholder="Enter title"
//                         value={incomeData.title}
//                         onChange={(e) => setIncomeData({ ...incomeData, title: e.target.value })}
//                         className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
//                       <select
//                         value={incomeData.category}
//                         onChange={(e) => setIncomeData({ ...incomeData, category: e.target.value })}
//                         className="cursor-pointer w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 bg-white shadow-sm"
//                       >
//                         {INCOME_CATEGORIES.map((c) => (
//                           <option key={c} value={c}>{c}</option>
//                         ))}
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Amount *</label>
//                       <input
//                         type="number"
//                         placeholder="0.00"
//                         value={incomeData.amount}
//                         onChange={(e) => setIncomeData({ ...incomeData, amount: e.target.value })}
//                         className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Currency</label>
//                       <select
//                         value={incomeData.currency}
//                         onChange={(e) => setIncomeData({ ...incomeData, currency: e.target.value })}
//                         className="cursor-pointer w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 bg-white shadow-sm"
//                       >
//                         {CURRENCIES.map((c) => (
//                           <option key={c} value={c}>{c}</option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   {/* Row 2: Date, Payment Method, Description */}
//                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
//                       <input
//                         type="date"
//                         value={incomeData.date}
//                         onChange={(e) => setIncomeData({ ...incomeData, date: e.target.value })}
//                         className="cursor-pointer w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Payment Method</label>
//                       <select
//                         value={incomeData.paymentMethod}
//                         onChange={(e) => setIncomeData({ ...incomeData, paymentMethod: e.target.value })}
//                         className="cursor-pointer w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 bg-white shadow-sm"
//                       >
//                         <option value="cash">Cash</option>
//                         <option value="bank">Bank Transfer</option>
//                         <option value="upi">UPI</option>
//                         <option value="card">Card</option>
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
//                       <textarea
//                         placeholder="Optional notes..."
//                         value={incomeData.description}
//                         onChange={(e) => setIncomeData({ ...incomeData, description: e.target.value })}
//                         rows={1}
//                         className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl resize-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>
//                   </div>

//                   {/* Save Button */}
//                   <div className="flex justify-end">
//                     <button
//                       onClick={handleIncome}
//                       className="cursor-pointer px-10 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-xl shadow-2xl transition-all transform hover:scale-105 text-lg"
//                     >
//                       {editingIncome ? "Update Income" : "Save Income"}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Income List */}
//                 <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-200/50 shadow-xl">
//                   <h3 className="text-3xl font-black text-green-700 mb-6 flex items-center justify-between">
//                     Recent Incomes
//                     <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-lg font-bold">
//                       {filteredIncomes.length} {filteredIncomes.length === 1 ? "item" : "items"}
//                     </span>
//                   </h3>
//                   <TransactionList
//                     items={filteredIncomes}
//                     type="income"
//                     onEdit={startEditIncome}
//                     onDelete={deleteIncome}
//                     currentPage={incomePage}
//                     setCurrentPage={setIncomePage}
//                   />
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-12">
//                 {/* Expense Form */}
//                 <div className="bg-gradient-to-br from-rose-50 to-red-100/50 rounded-2xl p-8 border-2 border-rose-200/50 shadow-lg">
//                   <div className="flex items-center justify-between mb-8">
//                     <h3 className="text-3xl font-black text-gray-800">
//                       {editingExpense ? "Edit Expense" : "Add New Expense"}
//                     </h3>
//                     {editingExpense && (
//                       <button
//                         onClick={cancelEdit}
//                         className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all"
//                       >
//                         Cancel
//                       </button>
//                     )}
//                   </div>

//                   {/* Row 1 */}
//                   <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Title *</label>
//                       <input
//                         type="text"
//                         placeholder="Enter title"
//                         value={expenseData.title}
//                         onChange={(e) => setExpenseData({ ...expenseData, title: e.target.value })}
//                         className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-rose-200 focus:border-rose-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
//                       <select
//                         value={expenseData.category}
//                         onChange={(e) => setExpenseData({ ...expenseData, category: e.target.value })}
//                         className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-rose-200 bg-white shadow-sm cursor-pointer"
//                       >
//                         {EXPENSE_CATEGORIES.map((c) => (
//                           <option key={c} value={c}>{c}</option>
//                         ))}
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Amount *</label>
//                       <input
//                         type="number"
//                         placeholder="0.00"
//                         value={expenseData.amount}
//                         onChange={(e) => setExpenseData({ ...expenseData, amount: e.target.value })}
//                         className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-rose-200 focus:border-rose-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Currency</label>
//                       <select
//                         value={expenseData.currency}
//                         onChange={(e) => setExpenseData({ ...expenseData, currency: e.target.value })}
//                         className="cursor-pointer w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-rose-200 bg-white shadow-sm"
//                       >
//                         {CURRENCIES.map((c) => (
//                           <option key={c} value={c}>{c}</option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   {/* Row 2 */}
//                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
//                       <input
//                         type="date"
//                         value={expenseData.date}
//                         onChange={(e) => setExpenseData({ ...expenseData, date: e.target.value })}
//                         className="cursor-pointer w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-rose-200 focus:border-rose-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Payment Method</label>
//                       <select
//                         value={expenseData.paymentMethod}
//                         onChange={(e) => setExpenseData({ ...expenseData, paymentMethod: e.target.value })}
//                         className="cursor-pointer w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-rose-200 bg-white shadow-sm"
//                       >
//                         <option value="cash">Cash</option>
//                         <option value="bank">Bank Transfer</option>
//                         <option value="upi">UPI</option>
//                         <option value="card">Card</option>
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
//                       <textarea
//                         placeholder="Optional notes..."
//                         value={expenseData.description}
//                         onChange={(e) => setExpenseData({ ...expenseData, description: e.target.value })}
//                         rows={1}
//                         className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl resize-none focus:ring-4 focus:ring-rose-200 focus:border-rose-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>
//                   </div>

//                   {/* Save Button */}
//                   <div className="flex justify-end">
//                     <button
//                       onClick={handleExpense}
//                       className="cursor-pointer px-10 py-4 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-bold rounded-xl shadow-2xl transition-all transform hover:scale-105 text-lg"
//                     >
//                       {editingExpense ? "Update Expense" : "Save Expense"}
//                     </button>
//                   </div>
//                 </div>
//                 {/* Expense List */}
//                 <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-200/50 shadow-xl">
//                   <h3 className="text-3xl font-black text-red-700 mb-6 flex items-center justify-between">
//                     Recent Expenses
//                     <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-lg font-bold">
//                       {filteredExpenses.length} {filteredExpenses.length === 1 ? "item" : "items"}
//                     </span>
//                   </h3>
//                   <TransactionList
//                     items={filteredExpenses}
//                     type="expense"
//                     onEdit={startEditExpense}
//                     onDelete={deleteExpense}
//                     currentPage={expensePage}
//                     setCurrentPage={setExpensePage}
//                   />
//                 </div>
//               </div>
//             )}

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


//============live currency WITH DOLLAR CURRENCY ALSO  NEW ON 17 DEC 2025==========

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../api";
// import TransactionList from "../components/TransactionList";

// export default function ProjectPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [mode, setMode] = useState("income");
//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Live rates state
//   const [liveRates, setLiveRates] = useState({ INR: 1 });
//   const [ratesLoading, setRatesLoading] = useState(true);
//   const [ratesError, setRatesError] = useState(false);

//   const CURRENCIES = ["USD", "AED", "INR", "CAD", "AUD"];
//   const currencySymbols = { USD: "$", AED: "د.إ", INR: "₹", CAD: "C$", AUD: "A$" };

//   const INCOME_CATEGORIES = ["MCO Meta", "MCO PPC", "Meta Rental", "Commission", "Technology Sale", "Domestic Tour Package", "International Tour Package", "Airline Ticket", "Hotel", "Car Hire", "Activities", "Airport Transfers", "Visa", "Others"];
//   const EXPENSE_CATEGORIES = ["Salaries", "Incentives", "Rent", "Travel Allowance Agent", "Travel Allowance Owner", "Meta Recharge", "Chargeback", "Refunds", "Miscellaneous Expenses", "Call Payment", "RDP Payment", "Ticket Issuance Pay", "API Payment", "Website Expenses", "Vonage Payment", "PPC Call Payment", "Campaign Payment", "Others"];

//   const [incomeData, setIncomeData] = useState({ title: "", category: "Others", amount: "", currency: "INR", commission: "", date: new Date().toISOString().split("T")[0], paymentMethod: "cash", description: "" });
//   const [expenseData, setExpenseData] = useState({ title: "", category: "Others", amount: "", currency: "INR", date: new Date().toISOString().split("T")[0], paymentMethod: "cash", description: "" });

//   const [incomes, setIncomes] = useState([]);
//   const [expenses, setExpenses] = useState([]);
//   const [summary, setSummary] = useState(null);
//   const [editingIncome, setEditingIncome] = useState(null);
//   const [editingExpense, setEditingExpense] = useState(null);
//   const [incomePage, setIncomePage] = useState(1);
//   const [expensePage, setExpensePage] = useState(1);

//   // Current month/year for default filter
//   const today = new Date();
//   const currentMonth = today.getMonth() + 1;
//   const currentYear = today.getFullYear();

//   const [filterMonth, setFilterMonth] = useState(currentMonth);
//   const [filterYear, setFilterYear] = useState(currentYear);

//   // Hardcoded fallback rates (used when live rates fail)
//   const FALLBACK_RATES_TO_INR = {
//     USD: 88.5,
//     AED: 24.1,
//     CAD: 63.8,
//     AUD: 58.4,
//     INR: 1,
//   };

//   // Helper: Get best available rate (live > fallback)
//   const getRate = (currency) => {
//     const liveRate = liveRates[currency];
//     if (liveRate && liveRate > 10) return liveRate; // reasonable check
//     return FALLBACK_RATES_TO_INR[currency] || 1;
//   };

//   // Convert INR → USD using live rate or fallback
//   const convertToUSD = (amountInINR) => {
//     if (!amountInINR) return "0.00";
//     const usdRate = getRate("USD"); // uses live if available
//     const usd = amountInINR / usdRate;
//     return usd.toLocaleString("en-US", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     });
//   };

//   // Fetch live exchange rates
//   useEffect(() => {
//     const fetchLiveRates = async () => {
//       try {
//         setRatesLoading(true);
//         setRatesError(false);
//         const res = await api.get("/finance/rates");

//         if (res.data.success && res.data.rates) {
//           setLiveRates({
//             INR: 1,
//             USD: res.data.rates.USD || 88.5,
//             AED: res.data.rates.AED || 24.1,
//             CAD: res.data.rates.CAD || 63.8,
//             AUD: res.data.rates.AUD || 58.4,
//           });
//         }
//       } catch (err) {
//         console.error("Live rates failed → using fallback", err);
//         setRatesError(true);
//         setLiveRates({
//           INR: 1,
//           USD: 88.5,
//           AED: 24.1,
//           CAD: 63.8,
//           AUD: 58.4,
//         });
//       } finally {
//         setRatesLoading(false);
//       }
//     };

//     fetchLiveRates();
//   }, []);

//   // Load project data
//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);
//       try {
//         const [proj, inc, exp, sum] = await Promise.all([
//           api.get(`/projects/${id}`),
//           api.get(`/finance/incomes?project=${id}`),
//           api.get(`/finance/expenses?project=${id}`),
//           api.get(`/finance/summary?project=${id}`).catch(() => ({ data: { success: false } })),
//         ]);

//         if (proj.data.success) setProject(proj.data.project);
//         setIncomes(inc.data.incomes || []);
//         setExpenses(exp.data.expenses || []);
//         if (sum.data.success) setSummary(sum.data.summary);
//       } catch (err) {
//         console.error("Load failed:", err);
//         alert("Failed to load project data");
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (id) load();
//   }, [id]);

//   const refreshData = async () => {
//     try {
//       const [inc, exp, sum] = await Promise.all([
//         api.get(`/finance/incomes?project=${id}`),
//         api.get(`/finance/expenses?project=${id}`),
//         api.get(`/finance/summary?project=${id}`).catch(() => ({ data: {} })),
//       ]);
//       setIncomes(inc.data.incomes || []);
//       setExpenses(exp.data.expenses || []);
//       if (sum.data.success) setSummary(sum.data.summary);
//     } catch (err) {
//       console.error("Refresh failed");
//     }
//   };

//   // Form handlers (unchanged)
//   const handleIncome = async () => {
//     if (!incomeData.title || !incomeData.amount) return alert("Title & Amount required");
//     const payload = { ...incomeData, amount: Number(incomeData.amount), commission: Number(incomeData.commission || 0), project: id };
//     try {
//       editingIncome
//         ? await api.put(`/finance/income/${editingIncome._id}`, payload)
//         : await api.post("/finance/income", payload);
//       setEditingIncome(null);
//       resetIncomeForm();
//       refreshData();
//     } catch (err) { alert("Save failed"); }
//   };

//   const handleExpense = async () => {
//     if (!expenseData.title || !expenseData.amount) return alert("Title & Amount required");
//     const payload = { ...expenseData, amount: Number(expenseData.amount), project: id };
//     try {
//       editingExpense
//         ? await api.put(`/finance/expense/${editingExpense._id}`, payload)
//         : await api.post("/finance/expense", payload);
//       setEditingExpense(null);
//       resetExpenseForm();
//       refreshData();
//     } catch (err) { alert("Save failed"); }
//   };

//   const resetIncomeForm = () => setIncomeData({ title: "", category: "Others", amount: "", currency: "INR", commission: "", date: new Date().toISOString().split("T")[0], paymentMethod: "cash", description: "" });
//   const resetExpenseForm = () => setExpenseData({ title: "", category: "Others", amount: "", currency: "INR", date: new Date().toISOString().split("T")[0], paymentMethod: "cash", description: "" });

//   const startEditIncome = (i) => {
//     setEditingIncome(i);
//     setIncomeData({ title: i.title, category: i.category, amount: i.amount, currency: i.currency, commission: i.commission || 0, date: i.date.split("T")[0], paymentMethod: i.paymentMethod || "cash", description: i.description || "" });
//   };

//   const startEditExpense = (e) => {
//     setEditingExpense(e);
//     setExpenseData({ title: e.title, category: e.category, amount: e.amount, currency: e.currency, date: e.date.split("T")[0], paymentMethod: e.paymentMethod || "cash", description: e.description || "" });
//   };

//   const cancelEdit = () => {
//     setEditingIncome(null);
//     setEditingExpense(null);
//     resetIncomeForm();
//     resetExpenseForm();
//   };

//   const deleteIncome = async (id) => { if (confirm("Delete this income?")) { await api.delete(`/finance/income/${id}`); refreshData(); } };
//   const deleteExpense = async (id) => { if (confirm("Delete this expense?")) { await api.delete(`/finance/expense/${id}`); refreshData(); } };

//   // Filtering
//   const applyFilter = (items) => {
//     return items.filter((item) => {
//       if (!filterMonth && !filterYear) return true;
//       const date = new Date(item.date);
//       const month = date.getMonth() + 1;
//       const year = date.getFullYear();
//       const monthMatch = filterMonth ? month === Number(filterMonth) : true;
//       const yearMatch = filterYear ? year === Number(filterYear) : true;
//       return monthMatch && yearMatch;
//     });
//   };

//   const filteredIncomes = applyFilter(incomes);
//   const filteredExpenses = applyFilter(expenses);

//   // Filtered Summary using live rates
//   const getFilteredSummary = () => {
//     const totalIncomeINR = filteredIncomes.reduce((sum, inc) => {
//       const amount = Number(inc.amount) || 0;
//       const rate = getRate(inc.currency || "INR");
//       return sum + amount * rate;
//     }, 0);

//     const totalCommissionINR = filteredIncomes.reduce((sum, inc) => {
//       const commission = Number(inc.commission || 0);
//       const rate = getRate(inc.currency || "INR");
//       return sum + commission * rate;
//     }, 0);

//     const totalExpenseINR = filteredExpenses.reduce((sum, exp) => {
//       const amount = Number(exp.amount) || 0;
//       const rate = getRate(exp.currency || "INR");
//       return sum + amount * rate;
//     }, 0);

//     const balanceINR = totalIncomeINR - totalExpenseINR;

//     return {
//       totalIncomeINR: Math.round(totalIncomeINR),
//       totalIncomeUSD: convertToUSD(totalIncomeINR),

//       totalExpenseINR: Math.round(totalExpenseINR),
//       totalExpenseUSD: convertToUSD(totalExpenseINR),

//       balanceINR: Math.round(balanceINR),
//       balanceUSD: convertToUSD(Math.abs(balanceINR)),

//       totalCommissionINR: Math.round(totalCommissionINR),
//       totalCommissionUSD: convertToUSD(totalCommissionINR),
//     };
//   };

//   const downloadReport = async () => {
//     try {
//       const params = new URLSearchParams();
//       params.append("project", id);
//       if (filterMonth) params.append("month", filterMonth);
//       if (filterYear) params.append("year", filterYear);

//       const res = await api.get(`/finance/download?${params.toString()}`, { responseType: "blob" });
//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const a = document.createElement("a");
//       a.href = url;

//       const filterText = filterMonth || filterYear
//         ? `${filterMonth ? monthNames[Number(filterMonth) - 1] : ""}_${filterYear || ""}`.trim().replace(" ", "_")
//         : "All_Time";

//       a.download = `${project?.name || "Project"}_Report_${filterText}.xlsx`;
//       a.click();
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       alert("Failed to download report");
//     }
//   };

//   if (loading) return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center"><div className="animate-spin h-12 w-12 border-4 border-blue-600 rounded-full border-t-transparent"></div></div>;
//   if (!project) return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-red-600 text-xl">Project not found</div>;

//   const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//   const isFiltered = filterMonth || filterYear;
//   const displayLabel = isFiltered
//     ? `${filterMonth ? monthNames[Number(filterMonth) - 1] : ""} ${filterYear || ""}`.trim() || "Filtered"
//     : "All Time";

//   const displayedSummary = isFiltered
//     ? getFilteredSummary()
//     : summary
//       ? {
//         totalIncomeINR: Math.round(summary.totalIncomeINR || 0),
//         totalIncomeUSD: convertToUSD(summary.totalIncomeINR || 0),
//         totalExpenseINR: Math.round(summary.totalExpenseINR || 0),
//         totalExpenseUSD: convertToUSD(summary.totalExpenseINR || 0),
//         balanceINR: Math.round(summary.balanceINR || 0),
//         balanceUSD: convertToUSD(Math.abs(summary.balanceINR || 0)),
//         totalCommissionINR: Math.round(summary.totalCommissionINR || 0),
//         totalCommissionUSD: convertToUSD(summary.totalCommissionINR || 0),
//       }
//       : {
//         totalIncomeINR: 0,
//         totalIncomeUSD: "0.00",
//         totalExpenseINR: 0,
//         totalExpenseUSD: "0.00",
//         balanceINR: 0,
//         balanceUSD: "0.00",
//         totalCommissionINR: 0,
//         totalCommissionUSD: "0.00",
//       };

//   // Rate status badge
//   const RateBadge = () => {
//     if (ratesLoading) return <span className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full">Loading rates...</span>;
//     if (ratesError) return <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">Fallback rates</span>;
//     return <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">Live Rates</span>;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-2xl sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
//           <div className="flex items-center gap-6">
//             <button onClick={() => navigate("/dashboard")} className="cursor-pointer px-6 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-all flex items-center gap-2">
//               Back to Projects
//             </button>
//             <div className="text-white">
//               <h1 className="text-4xl font-bold">{project.name}</h1>
//               <p className="text-blue-100 mt-2 text-lg">{project.description || "No description"}</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-4">
//             <RateBadge />
//             <button onClick={downloadReport} className="cursor-pointer  px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-xl shadow-2xl transition-all flex items-center gap-3">
//               Download Excel Report
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-10">

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
//           {/* Income */}
//           <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden">
//             <p className="text-emerald-100 font-semibold text-lg">Total Income</p>
//             <p className="text-4xl font-black mt-4">₹ {displayedSummary.totalIncomeINR.toLocaleString("en-IN")}</p>
//             <p className="text-2xl font-bold mt-2 opacity-90">$ {displayedSummary.totalIncomeUSD}</p>
//             {isFiltered && <span className="absolute top-3 right-3 bg-white/30 px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm">{displayLabel}</span>}
//           </div>

//           {/* Commission */}
//           <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden">
//             <p className="text-purple-100 font-semibold text-lg">Commission Earned</p>
//             <p className="text-4xl font-black mt-4">₹ {displayedSummary.totalCommissionINR.toLocaleString("en-IN")}</p>
//             <p className="text-2xl font-bold mt-2 opacity-90">$ {displayedSummary.totalCommissionUSD}</p>
//             {isFiltered && <span className="absolute top-3 right-3 bg-white/30 px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm">{displayLabel}</span>}
//           </div>

//           {/* Expense */}
//           <div className="bg-gradient-to-br from-rose-500 to-red-600 text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden">
//             <p className="text-rose-100 font-semibold text-lg">Total Expenses</p>
//             <p className="text-4xl font-black mt-4">₹ {displayedSummary.totalExpenseINR.toLocaleString("en-IN")}</p>
//             <p className="text-2xl font-bold mt-2 opacity-90">$ {displayedSummary.totalExpenseUSD}</p>
//             {isFiltered && <span className="absolute top-3 right-3 bg-white/30 px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm">{displayLabel}</span>}
//           </div>

//           {/* Balance */}
//           <div className={`bg-gradient-to-br ${displayedSummary.balanceINR >= 0 ? "from-blue-500 to-cyan-600" : "from-amber-500 to-orange-600"} text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden`}>
//             <p className="text-blue-100 font-semibold text-lg">Balance</p>
//             <p className="text-4xl font-black mt-4">
//               ₹ {Math.abs(displayedSummary.balanceINR).toLocaleString("en-IN")}
//               {displayedSummary.balanceINR < 0 && <span className="block text-lg mt-2">(Deficit)</span>}
//             </p>
//             <p className="text-2xl font-bold mt-2 opacity-90">
//               $ {displayedSummary.balanceUSD}
//               {displayedSummary.balanceINR < 0 && <span className="opacity-70"> (Deficit)</span>}
//             </p>
//             {isFiltered && <span className="absolute top-3 right-3 bg-white/30 px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm">{displayLabel}</span>}
//           </div>
//         </div>




//         {/* Filter Bar */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex flex-wrap items-end gap-4">
//           <div className="flex-1 min-w-[200px]">
//             <label className="block text-gray-700 font-bold mb-2">Filter by Month</label>
//             <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="cursor-pointer  w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500">
//               <option value="">All Months</option>
//               {monthNames.map((m, i) => (
//                 <option key={i + 1} value={i + 1}>{m}</option>
//               ))}
//             </select>
//           </div>

//           <div className="flex-1 min-w-[200px]">
//             <label className="block text-gray-700 font-bold mb-2">Filter by Year</label>
//             <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="cursor-pointer w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500">
//               <option value="">All Years</option>
//               {[2024, 2025, 2026, 2027, 2028, 2029, 2030,2031, 2032, 2033].map(year => (
//                 <option key={year} value={year}>{year}</option>
//               ))}
//             </select>
//           </div>

//           <button onClick={() => { setFilterMonth(currentMonth); setFilterYear(currentYear); }} className="cursor-pointer px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all">
//             Current Month
//           </button>
//           <button onClick={() => { setFilterMonth(""); setFilterYear(""); }} className="cursor-pointer px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-xl transition-all">
//             All Time
//           </button>
//         </div>

//         <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
//           {/* Tabs */}
//           <div className="flex border-b bg-gradient-to-r from-gray-50 to-blue-50/50">
//             <button onClick={() => { setMode("income"); cancelEdit(); }} className={`cursor-pointer flex-1 py-6 text-xl font-black transition-all relative ${mode === "income" ? "text-blue-700 bg-white shadow-lg" : "text-gray-500 hover:text-gray-800"}`}>
//               {editingIncome ? "Edit Income" : "Add Income"}
//               {mode === "income" && <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>}
//             </button>
//             <button onClick={() => { setMode("expense"); cancelEdit(); }} className={`cursor-pointer flex-1 py-6 text-xl font-black transition-all relative ${mode === "expense" ? "text-blue-700 bg-white shadow-lg" : "text-gray-500 hover:text-gray-800"}`}>
//               {editingExpense ? "Edit Expense" : "Add Expense"}
//               {mode === "expense" && <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>}
//             </button>
//           </div>

//           <div className="p-10">

//             {mode === "income" ? (
//               <div className="space-y-12">
//                 {/* Income Form */}
//                 <div className="bg-gradient-to-br from-green-50 to-emerald-100/50 rounded-2xl p-8 border-2 border-emerald-200/50 shadow-lg">
//                   <div className="flex items-center justify-between mb-8">
//                     <h3 className="text-3xl font-black text-gray-800">
//                       {editingIncome ? "Edit Income" : "Add New Income"}
//                     </h3>
//                     {editingIncome && (
//                       <button
//                         onClick={cancelEdit}
//                         className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all"
//                       >
//                         Cancel
//                       </button>
//                     )}
//                   </div>

//                   {/* Row 1: Title, Category, Amount, Currency */}
//                   <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Title *</label>
//                       <input
//                         type="text"
//                         placeholder="Enter title"
//                         value={incomeData.title}
//                         onChange={(e) => setIncomeData({ ...incomeData, title: e.target.value })}
//                         className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
//                       <select
//                         value={incomeData.category}
//                         onChange={(e) => setIncomeData({ ...incomeData, category: e.target.value })}
//                         className="cursor-pointer w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 bg-white shadow-sm"
//                       >
//                         {INCOME_CATEGORIES.map((c) => (
//                           <option key={c} value={c}>{c}</option>
//                         ))}
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Amount *</label>
//                       <input
//                         type="number"
//                         placeholder="0.00"
//                         value={incomeData.amount}
//                         onChange={(e) => setIncomeData({ ...incomeData, amount: e.target.value })}
//                         className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Currency</label>
//                       <select
//                         value={incomeData.currency}
//                         onChange={(e) => setIncomeData({ ...incomeData, currency: e.target.value })}
//                         className="cursor-pointer w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 bg-white shadow-sm"
//                       >
//                         {CURRENCIES.map((c) => (
//                           <option key={c} value={c}>{c}</option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   {/* Row 2: Date, Payment Method, Description */}
//                   <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Commission</label>
//                       <input
//                         type="number"
//                         placeholder="0.00"
//                         value={incomeData.commission}
//                         onChange={(e) =>
//                           setIncomeData({ ...incomeData, commission: e.target.value })
//                         }
//                         className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
//                       <input
//                         type="date"
//                         value={incomeData.date}
//                         onChange={(e) => setIncomeData({ ...incomeData, date: e.target.value })}
//                         className="cursor-pointer w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Payment Method</label>
//                       <select
//                         value={incomeData.paymentMethod}
//                         onChange={(e) => setIncomeData({ ...incomeData, paymentMethod: e.target.value })}
//                         className="cursor-pointer w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 bg-white shadow-sm"
//                       >
//                         <option value="cash">Cash</option>
//                         <option value="bank">Bank Transfer</option>
//                         <option value="upi">UPI</option>
//                         <option value="card">Card</option>
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
//                       <textarea
//                         placeholder="Optional notes..."
//                         value={incomeData.description}
//                         onChange={(e) => setIncomeData({ ...incomeData, description: e.target.value })}
//                         rows={1}
//                         className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl resize-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>
//                   </div>
//                   <p className="text-xs text-gray-500 mt-2">
//                     Note: Commission is stored in the same currency as the income.
//                     Commission is not added to the total income amount.
//                   </p>

//                   {/* Save Button */}
//                   <div className="flex justify-end">
//                     <button
//                       onClick={handleIncome}
//                       className="cursor-pointer px-10 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-xl shadow-2xl transition-all transform hover:scale-105 text-lg"
//                     >
//                       {editingIncome ? "Update Income" : "Save Income"}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Income List */}
//                 <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-200/50 shadow-xl">
//                   <h3 className="text-3xl font-black text-green-700 mb-6 flex items-center justify-between">
//                     Recent Incomes
//                     <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-lg font-bold">
//                       {filteredIncomes.length} {filteredIncomes.length === 1 ? "item" : "items"}
//                     </span>
//                   </h3>
//                   <TransactionList
//                     items={filteredIncomes}
//                     type="income"
//                     onEdit={startEditIncome}
//                     onDelete={deleteIncome}
//                     currentPage={incomePage}
//                     setCurrentPage={setIncomePage}
//                   />
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-12">
//                 {/* Expense Form */}
//                 <div className="bg-gradient-to-br from-rose-50 to-red-100/50 rounded-2xl p-8 border-2 border-rose-200/50 shadow-lg">
//                   <div className="flex items-center justify-between mb-8">
//                     <h3 className="text-3xl font-black text-gray-800">
//                       {editingExpense ? "Edit Expense" : "Add New Expense"}
//                     </h3>
//                     {editingExpense && (
//                       <button
//                         onClick={cancelEdit}
//                         className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all"
//                       >
//                         Cancel
//                       </button>
//                     )}
//                   </div>

//                   {/* Row 1 */}
//                   <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Title *</label>
//                       <input
//                         type="text"
//                         placeholder="Enter title"
//                         value={expenseData.title}
//                         onChange={(e) => setExpenseData({ ...expenseData, title: e.target.value })}
//                         className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-rose-200 focus:border-rose-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
//                       <select
//                         value={expenseData.category}
//                         onChange={(e) => setExpenseData({ ...expenseData, category: e.target.value })}
//                         className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-rose-200 bg-white shadow-sm cursor-pointer"
//                       >
//                         {EXPENSE_CATEGORIES.map((c) => (
//                           <option key={c} value={c}>{c}</option>
//                         ))}
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Amount *</label>
//                       <input
//                         type="number"
//                         placeholder="0.00"
//                         value={expenseData.amount}
//                         onChange={(e) => setExpenseData({ ...expenseData, amount: e.target.value })}
//                         className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-rose-200 focus:border-rose-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Currency</label>
//                       <select
//                         value={expenseData.currency}
//                         onChange={(e) => setExpenseData({ ...expenseData, currency: e.target.value })}
//                         className="cursor-pointer w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-rose-200 bg-white shadow-sm"
//                       >
//                         {CURRENCIES.map((c) => (
//                           <option key={c} value={c}>{c}</option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   {/* Row 2 */}
//                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
//                       <input
//                         type="date"
//                         value={expenseData.date}
//                         onChange={(e) => setExpenseData({ ...expenseData, date: e.target.value })}
//                         className="cursor-pointer w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-rose-200 focus:border-rose-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Payment Method</label>
//                       <select
//                         value={expenseData.paymentMethod}
//                         onChange={(e) => setExpenseData({ ...expenseData, paymentMethod: e.target.value })}
//                         className="cursor-pointer w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-rose-200 bg-white shadow-sm"
//                       >
//                         <option value="cash">Cash</option>
//                         <option value="bank">Bank Transfer</option>
//                         <option value="upi">UPI</option>
//                         <option value="card">Card</option>
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
//                       <textarea
//                         placeholder="Optional notes..."
//                         value={expenseData.description}
//                         onChange={(e) => setExpenseData({ ...expenseData, description: e.target.value })}
//                         rows={1}
//                         className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl resize-none focus:ring-4 focus:ring-rose-200 focus:border-rose-500 transition-all bg-white shadow-sm"
//                       />
//                     </div>
//                   </div>

//                   {/* Save Button */}
//                   <div className="flex justify-end">
//                     <button
//                       onClick={handleExpense}
//                       className="cursor-pointer px-10 py-4 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-bold rounded-xl shadow-2xl transition-all transform hover:scale-105 text-lg"
//                     >
//                       {editingExpense ? "Update Expense" : "Save Expense"}
//                     </button>
//                   </div>
//                 </div>
//                 {/* Expense List */}
//                 <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-200/50 shadow-xl">
//                   <h3 className="text-3xl font-black text-red-700 mb-6 flex items-center justify-between">
//                     Recent Expenses
//                     <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-lg font-bold">
//                       {filteredExpenses.length} {filteredExpenses.length === 1 ? "item" : "items"}
//                     </span>
//                   </h3>
//                   <TransactionList
//                     items={filteredExpenses}
//                     type="expense"
//                     onEdit={startEditExpense}
//                     onDelete={deleteExpense}
//                     currentPage={expensePage}
//                     setCurrentPage={setExpensePage}
//                   />
//                 </div>
//               </div>
//             )}

//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }



//==================with paid,chargeback,refund and financial reminder on 31 dec 2025==================

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import TransactionList from "../components/TransactionList";

export default function ProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState("income");
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Live rates state
  const [liveRates, setLiveRates] = useState({ INR: 1 });
  const [ratesStatus, setRatesStatus] = useState("idle"); // idle | loading | success | error
  const [ratesError, setRatesError] = useState(false);

  const [showReminderModal, setShowReminderModal] = useState(false);
  const [tempReminderNote, setTempReminderNote] = useState("");

  const CURRENCIES = ["INR", "USD", "AED", "CAD", "AUD"];
  const currencySymbols = { USD: "$", AED: "د.إ", INR: "₹", CAD: "C$", AUD: "A$" };

  const INCOME_CATEGORIES = [
    "MCO Meta", "MCO PPC", "Meta Rental", "Commission", "Technology Sale",
    "Domestic Tour Package", "International Tour Package", "Airline Ticket",
    "Hotel", "Car Hire", "Activities", "Airport Transfers", "Visa",
        "PAID", "REFUND", "CHARGEBACK", "VOID",
    
    "Others"
  ];
  const EXPENSE_CATEGORIES = [
    "Salaries", "Incentives", "Rent", "Travel Allowance Agent", "Travel Allowance Owner",
    "Meta Recharge", "Chargeback", "Refunds", "Miscellaneous Expenses", "Call Payment",
    "RDP Payment", "Ticket Issuance Pay", "API Payment", "Website Expenses",
    "Vonage Payment", "PPC Call Payment", "Campaign Payment", "Others"
  ];

  const [incomeData, setIncomeData] = useState({
    title: "", category: "Others", amount: "", currency: "INR",
    commission: "", date: new Date().toISOString().split("T")[0],
    paymentMethod: "cash", description: "", financialReminderNote: "",
  });
  const [expenseData, setExpenseData] = useState({
    title: "", category: "Others", amount: "", currency: "INR",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "cash", description: ""
  });

  const NEGATIVE_CATEGORIES = ["refund", "chargeback", "void"];
const isNegativeCategory = (category = "") =>
  NEGATIVE_CATEGORIES.includes(category.toLowerCase());

  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [editingIncome, setEditingIncome] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [incomePage, setIncomePage] = useState(1);
  const [expensePage, setExpensePage] = useState(1);

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  const [filterMonth, setFilterMonth] = useState(currentMonth);
  const [filterYear, setFilterYear] = useState(currentYear);

  // Hardcoded fallback rates (update periodically)
  // const FALLBACK_RATES_TO_INR = {
  //   USD: 85.5,
  //   AED: 23.2,
  //   CAD: 62.5,
  //   AUD: 57.0,
  //   INR: 1,
  // };

    const FALLBACK_RATES_TO_INR = {
    USD:   89.82,
    AED: 24.49,
    CAD: 65.64,
    AUD: 60.18,
    INR: 1,
  };

  const getRate = (currency) => {
    if (!currency || currency === "INR") return 1;
    const live = liveRates[currency];
    if (typeof live === "number" && live > 5) return live;
    return FALLBACK_RATES_TO_INR[currency] ?? 1;
  };



  const convertToUSD = (amountInINR = 0) => {
    const usdRate = getRate("USD");
    const usd = Number(amountInINR) / usdRate;
    return usd.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      signDisplay: "exceptZero",
    });
  };

  // Fetch live exchange rates with retry
  const fetchLiveRates = async (attempt = 1) => {
    setRatesStatus("loading");
    setRatesError(false);

    try {
      const res = await api.get("/finance/rates", { timeout: 10000 });

      if (res.data.success && res.data.rates) {
        setLiveRates({
          INR: 1,
          USD: res.data.rates.USD || FALLBACK_RATES_TO_INR.USD,
          AED: res.data.rates.AED || FALLBACK_RATES_TO_INR.AED,
          CAD: res.data.rates.CAD || FALLBACK_RATES_TO_INR.CAD,
          AUD: res.data.rates.AUD || FALLBACK_RATES_TO_INR.AUD,
        });
        setRatesStatus("success");
      } else {
        throw new Error("Invalid rates response");
      }
    } catch (err) {
      console.warn(`Rates fetch attempt ${attempt} failed:`, err.message);
      if (attempt === 1) {
        setTimeout(() => fetchLiveRates(2), 1500);
      } else {
        console.error("Live rates failed → using fallback");
        setLiveRates({ ...FALLBACK_RATES_TO_INR });
        setRatesStatus("error");
        setRatesError(true);
      }
    }
  };

  useEffect(() => {
    fetchLiveRates();
  }, []);

  // Load project data
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [proj, inc, exp, sum] = await Promise.all([
          api.get(`/projects/${id}`),
          api.get(`/finance/incomes?project=${id}`),
          api.get(`/finance/expenses?project=${id}`),
          api.get(`/finance/summary?project=${id}`).catch(() => ({ data: { success: false } })),
        ]);

        if (proj.data.success) setProject(proj.data.project);
        setIncomes(inc.data.incomes || []);
        setExpenses(exp.data.expenses || []);
        if (sum.data.success) setSummary(sum.data.summary);
      } catch (err) {
        console.error("Load failed:", err);
        alert("Failed to load project data");
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);



  const refreshData = async () => {
    try {
      const [inc, exp, sum] = await Promise.all([
        api.get(`/finance/incomes?project=${id}`),
        api.get(`/finance/expenses?project=${id}`),
        api.get(`/finance/summary?project=${id}`).catch(() => ({ data: {} })),
      ]);
      console.log("Fresh incomes from API:", inc.data.incomes); // ← Check if reminder is here
      setIncomes(inc.data.incomes || []);
      setExpenses(exp.data.expenses || []);
      if (sum.data.success) setSummary(sum.data.summary);
    } catch (err) {
      console.error("Refresh failed");
    }
  };


  const handleIncome = async () => {
    if (!incomeData.title || !incomeData.amount) {
      return alert("Title & Amount required");
    }

    if (!editingIncome && !incomeData.financialReminderNote.trim()) {
      setTempReminderNote("");
      setShowReminderModal(true);
      return;
    }

    await saveIncome(); // Normal save
  };




  const saveIncome = async (overrideReminderNote = null) => {
    const finalNote = overrideReminderNote !== null
      ? overrideReminderNote.trim()
      : (incomeData.financialReminderNote || "").trim();

    const payload = {
      ...incomeData,
      amount: Number(incomeData.amount),
      commission: Number(incomeData.commission || 0),
      financialReminderNote: finalNote,
      project: id,
    };

    try {
      if (editingIncome) {
        await api.put(`/finance/income/${editingIncome._id}`, payload);
        alert("Income updated successfully!");
      } else {
        await api.post("/finance/income", payload);
        alert("Income saved successfully! ✓");
      }

      setEditingIncome(null);
      resetIncomeForm();
      refreshData();
    } catch (err) {
      console.error(err);
      alert("Save failed: " + (err.response?.data?.error || err.message));
    }
  };

  const handleExpense = async () => {
    if (!expenseData.title || !expenseData.amount) return alert("Title & Amount required");
    const payload = {
      ...expenseData,
      amount: Number(expenseData.amount),
      project: id,
    };
    try {
      if (editingExpense) {
        await api.put(`/finance/expense/${editingExpense._id}`, payload);
      } else {
        await api.post("/finance/expense", payload);
      }
      setEditingExpense(null);
      resetExpenseForm();
      refreshData();
    } catch (err) {
      alert("Save failed");
    }
  };

  const resetIncomeForm = () => setIncomeData({
    title: "", category: "Others", amount: "", currency: "INR",
    commission: "", date: new Date().toISOString().split("T")[0],
    paymentMethod: "cash", description: "",
    financialReminderNote: "",
  });

  const resetExpenseForm = () => setExpenseData({
    title: "", category: "Others", amount: "", currency: "INR",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "cash", description: ""
  });

  const startEditIncome = (item) => {
    setEditingIncome(item);
    setIncomeData({
      title: item.title,
      category: item.category,
      amount: item.amount,
      currency: item.currency,
      commission: item.commission || 0,
      date: item.date.split("T")[0],
      paymentMethod: item.paymentMethod || "cash",
      description: item.description || "",
      financialReminderNote: item.financialReminderNote || "",

    });
  };

  const startEditExpense = (item) => {
    setEditingExpense(item);
    setExpenseData({
      title: item.title,
      category: item.category,
      amount: item.amount,
      currency: item.currency,
      date: item.date.split("T")[0],
      paymentMethod: item.paymentMethod || "cash",
      description: item.description || "",
    });
  };

  const cancelEdit = () => {
    setEditingIncome(null);
    setEditingExpense(null);
    resetIncomeForm();
    resetExpenseForm();
  };

  const deleteIncome = async (id) => {
    if (confirm("Delete this income?")) {
      await api.delete(`/finance/income/${id}`);
      refreshData();
    }
  };

  const deleteExpense = async (id) => {
    if (confirm("Delete this expense?")) {
      await api.delete(`/finance/expense/${id}`);
      refreshData();
    }
  };

  const applyFilter = (items) => {
    return items.filter((item) => {
      if (!filterMonth && !filterYear) return true;
      const date = new Date(item.date);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const monthMatch = filterMonth ? month === Number(filterMonth) : true;
      const yearMatch = filterYear ? year === Number(filterYear) : true;
      return monthMatch && yearMatch;
    });
  };

  const filteredIncomes = applyFilter(incomes);
  const filteredExpenses = applyFilter(expenses);

  const getFilteredSummary = () => {
    const totalIncomeINR = filteredIncomes.reduce((sum, inc) => {
      const amount = Number(inc.amount) || 0;
      const rate = getRate(inc.currency || "INR");
      return sum + amount * rate;
    }, 0);

    const totalCommissionINR = filteredIncomes.reduce((sum, inc) => {
      const commission = Number(inc.commission || 0);
      const rate = getRate(inc.currency || "INR");
      return sum + commission * rate;
    }, 0);

    const totalExpenseINR = filteredExpenses.reduce((sum, exp) => {
      const amount = Number(exp.amount) || 0;
      const rate = getRate(exp.currency || "INR");
      return sum + amount * rate;
    }, 0);

    const balanceINR = totalIncomeINR - totalExpenseINR;

    return {
      totalIncomeINR: Math.round(totalIncomeINR),
      totalIncomeUSD: convertToUSD(totalIncomeINR),
      totalExpenseINR: Math.round(totalExpenseINR),
      totalExpenseUSD: convertToUSD(totalExpenseINR),
      balanceINR: Math.round(balanceINR),
      balanceUSD: convertToUSD(Math.abs(balanceINR)),
      totalCommissionINR: Math.round(totalCommissionINR),
      totalCommissionUSD: convertToUSD(totalCommissionINR),
    };
  };

  const downloadReport = async () => {
    try {
      const params = new URLSearchParams();
      params.append("project", id);
      if (filterMonth) params.append("month", filterMonth);
      if (filterYear) params.append("year", filterYear);

      const res = await api.get(`/finance/download?${params.toString()}`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;

      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const filterText = filterMonth || filterYear
        ? `${filterMonth ? monthNames[Number(filterMonth) - 1] : ""}_${filterYear || ""}`.trim().replace(" ", "_")
        : "All_Time";

      a.download = `${project?.name || "Project"}_Report_${filterText}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download report");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-blue-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-red-600 text-xl">
        Project not found
      </div>
    );
  }

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const isFiltered = filterMonth || filterYear;
  const displayLabel = isFiltered
    ? `${filterMonth ? monthNames[Number(filterMonth) - 1] : ""} ${filterYear || ""}`.trim() || "Filtered"
    : "All Time";

  const displayedSummary = isFiltered
    ? getFilteredSummary()
    : summary
      ? {
        totalIncomeINR: Math.round(summary.totalIncomeINR || 0),
        totalIncomeUSD: convertToUSD(summary.totalIncomeINR || 0),
        totalExpenseINR: Math.round(summary.totalExpenseINR || 0),
        totalExpenseUSD: convertToUSD(summary.totalExpenseINR || 0),
        balanceINR: Math.round(summary.balanceINR || 0),
        balanceUSD: convertToUSD(Math.abs(summary.balanceINR || 0)),
        totalCommissionINR: Math.round(summary.totalCommissionINR || 0),
        totalCommissionUSD: convertToUSD(summary.totalCommissionINR || 0),
      }
      : {
        totalIncomeINR: 0,
        totalIncomeUSD: "0.00",
        totalExpenseINR: 0,
        totalExpenseUSD: "0.00",
        balanceINR: 0,
        balanceUSD: "0.00",
        totalCommissionINR: 0,
        totalCommissionUSD: "0.00",
      };

  const RateBadge = () => {
    if (ratesStatus === "loading") {
      return <span className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full animate-pulse">Loading rates...</span>;
    }
    if (ratesStatus === "error") {
      return <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full">Fallback rates</span>;
    }
    if (ratesStatus === "success") {
      return <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full">Live Rates ✓</span>;
    }
    return <span className="bg-gray-400 text-white text-xs px-3 py-1 rounded-full">Rates status unknown</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/dashboard")}
              className="cursor-pointer px-6 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-all flex items-center gap-2"
            >
              Back to Projects
            </button>
            <div className="text-white">
              <h1 className="text-4xl font-bold">{project.name}</h1>
              <p className="text-blue-100 mt-2 text-lg">{project.description || "No description"}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <RateBadge />
            <button
              onClick={downloadReport}
              className="cursor-pointer px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-xl shadow-2xl transition-all flex items-center gap-3"
            >
              Download Excel Report
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            <p className="text-emerald-100 font-semibold text-lg">Total Income</p>
            <p className="text-4xl font-black mt-4">₹ {displayedSummary.totalIncomeINR.toLocaleString("en-IN")}</p>
            <p className="text-2xl font-bold mt-2 opacity-90">$ {displayedSummary.totalIncomeUSD}</p>
            {isFiltered && <span className="absolute top-3 right-3 bg-white/30 px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm">{displayLabel}</span>}
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            <p className="text-purple-100 font-semibold text-lg">Commission Earned</p>
            <p className="text-4xl font-black mt-4">₹ {displayedSummary.totalCommissionINR.toLocaleString("en-IN")}</p>
            <p className="text-2xl font-bold mt-2 opacity-90">$ {displayedSummary.totalCommissionUSD}</p>
            {isFiltered && <span className="absolute top-3 right-3 bg-white/30 px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm">{displayLabel}</span>}
          </div>

          <div className="bg-gradient-to-br from-rose-500 to-red-600 text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            <p className="text-rose-100 font-semibold text-lg">Total Expenses</p>
            <p className="text-4xl font-black mt-4">₹ {displayedSummary.totalExpenseINR.toLocaleString("en-IN")}</p>
            <p className="text-2xl font-bold mt-2 opacity-90">$ {displayedSummary.totalExpenseUSD}</p>
            {isFiltered && <span className="absolute top-3 right-3 bg-white/30 px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm">{displayLabel}</span>}
          </div>

          <div className={`bg-gradient-to-br ${displayedSummary.balanceINR >= 0 ? "from-blue-500 to-cyan-600" : "from-amber-500 to-orange-600"} text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden`}>
            <p className="text-blue-100 font-semibold text-lg">Balance</p>
            <p className="text-4xl font-black mt-4">
              ₹ {Math.abs(displayedSummary.balanceINR).toLocaleString("en-IN")}
              {displayedSummary.balanceINR < 0 && <span className="block text-lg mt-2">(Deficit)</span>}
            </p>
            <p className="text-2xl font-bold mt-2 opacity-90">
              $ {displayedSummary.balanceUSD}
              {displayedSummary.balanceINR < 0 && <span className="opacity-70"> (Deficit)</span>}
            </p>
            {isFiltered && <span className="absolute top-3 right-3 bg-white/30 px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm">{displayLabel}</span>}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-gray-700 font-bold mb-2">Filter by Month</label>
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="cursor-pointer w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
            >
              <option value="">All Months</option>
              {monthNames.map((m, i) => (
                <option key={i + 1} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-gray-700 font-bold mb-2">Filter by Year</label>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="cursor-pointer w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
            >
              <option value="">All Years</option>
              {[2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033].map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => { setFilterMonth(currentMonth); setFilterYear(currentYear); }}
            className="cursor-pointer px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all"
          >
            Current Month
          </button>
          <button
            onClick={() => { setFilterMonth(""); setFilterYear(""); }}
            className="cursor-pointer px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-xl transition-all"
          >
            All Time
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          <div className="flex border-b bg-gradient-to-r from-gray-50 to-blue-50/50">
            <button
              onClick={() => { setMode("income"); cancelEdit(); }}
              className={`cursor-pointer flex-1 py-6 text-xl font-black transition-all relative ${mode === "income" ? "text-blue-700 bg-white shadow-lg" : "text-gray-500 hover:text-gray-800"}`}
            >
              {editingIncome ? "Edit Income" : "Add Income"}
              {mode === "income" && <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>}
            </button>
            <button
              onClick={() => { setMode("expense"); cancelEdit(); }}
              className={`cursor-pointer flex-1 py-6 text-xl font-black transition-all relative ${mode === "expense" ? "text-blue-700 bg-white shadow-lg" : "text-gray-500 hover:text-gray-800"}`}
            >
              {editingExpense ? "Edit Expense" : "Add Expense"}
              {mode === "expense" && <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>}
            </button>
          </div>

          <div className="p-10">
            {mode === "income" ? (
              <div className="space-y-12">
                {/* Income Form */}


                <div className="bg-gradient-to-br from-green-50 to-emerald-100/50 rounded-2xl p-6 lg:p-8 border-2 border-emerald-200/50 shadow-lg">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl lg:text-3xl font-black text-gray-800">
                      {editingIncome ? "Edit Income" : "Add New Income"}
                    </h3>
                    {editingIncome && (
                      <button
                        onClick={cancelEdit}
                        className="cursor-pointer px-6 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all text-sm lg:text-base"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  {/* First row - 4 columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Title *</label>
                      <input type="text" placeholder="Enter title" value={incomeData.title} onChange={(e) => setIncomeData({ ...incomeData, title: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 bg-white shadow-sm" />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Category</label>
                      <select value={incomeData.category} onChange={(e) => setIncomeData({ ...incomeData, category: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 bg-white shadow-sm cursor-pointer">
                        {INCOME_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Amount *</label>
                      <input type="number" placeholder="0.00" value={incomeData.amount} onChange={(e) => setIncomeData({ ...incomeData, amount: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 bg-white shadow-sm" />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Currency</label>
                      <select value={incomeData.currency} onChange={(e) => setIncomeData({ ...incomeData, currency: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 bg-white shadow-sm cursor-pointer">
                        {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Second row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Commission</label>
                      <input type="number" placeholder="0.00" value={incomeData.commission} onChange={(e) => setIncomeData({ ...incomeData, commission: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 bg-white shadow-sm" />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Date</label>
                      <input type="date" value={incomeData.date} onChange={(e) => setIncomeData({ ...incomeData, date: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 bg-white shadow-sm cursor-pointer" />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Payment Method</label>
                      <select value={incomeData.paymentMethod} onChange={(e) => setIncomeData({ ...incomeData, paymentMethod: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 bg-white shadow-sm cursor-pointer">
                        <option value="cash">Cash</option>
                        <option value="bank">Bank Transfer</option>
                        <option value="upi">UPI</option>
                        <option value="card">Card</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Description</label>
                      <textarea placeholder="Optional notes..." value={incomeData.description} onChange={(e) => setIncomeData({ ...incomeData, description: e.target.value })} rows={1} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl resize-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 bg-white shadow-sm" />
                    </div>
                  </div>

                  {/* Commission note + Financial Reminder + Save button */}
                  <div className="space-y-5">
                    <p className="text-xs text-gray-600">
                      Note: Commission is stored in the same currency as the income. It is not added to the total income amount.
                    </p>


                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">
                        Financial Reminder Note
                      </label>

                      <textarea
                        placeholder="Reminders, follow-ups, important notes, next actions..."
                        value={incomeData.financialReminderNote || ""}
                        onChange={(e) =>
                          setIncomeData({
                            ...incomeData,
                            financialReminderNote: e.target.value,
                          })
                        }
                        rows={1}
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl resize-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all bg-white shadow-sm"
                      />
                    </div>


                    {/* Save Button - stays at the end, good position */}
                    <div className="flex justify-end">
                      <button
                        onClick={handleIncome}
                        className="cursor-pointer px-10 py-3.5 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-105 text-base lg:text-lg"
                      >
                        {editingIncome ? "Update Income" : "Save Income"}
                      </button>
                    </div>
                  </div>
                </div>



                {/* Income List */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-200/50 shadow-xl">
                  <h3 className="text-3xl font-black text-green-700 mb-6 flex items-center justify-between">
                    Recent Incomes
                    <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-lg font-bold">
                      {filteredIncomes.length} {filteredIncomes.length === 1 ? "item" : "items"}
                    </span>
                  </h3>
                  <TransactionList
                    items={filteredIncomes}
                    type="income"
                    onEdit={startEditIncome}
                    onDelete={deleteIncome}
                    currentPage={incomePage}
                    setCurrentPage={setIncomePage}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-12">
                {/* Expense Form */}
                <div className="bg-gradient-to-br from-rose-50 to-red-100/50 rounded-2xl p-8 border-2 border-rose-200/50 shadow-lg">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-3xl font-black text-gray-800">
                      {editingExpense ? "Edit Expense" : "Add New Expense"}
                    </h3>
                    {editingExpense && (
                      <button
                        onClick={cancelEdit}
                        className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Title *</label>
                      <input
                        type="text"
                        placeholder="Enter title"
                        value={expenseData.title}
                        onChange={(e) => setExpenseData({ ...expenseData, title: e.target.value })}
                        className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-rose-200 focus:border-rose-500 transition-all bg-white shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                      <select
                        value={expenseData.category}
                        onChange={(e) => setExpenseData({ ...expenseData, category: e.target.value })}
                        className="cursor-pointer w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-rose-200 bg-white shadow-sm"
                      >
                        {EXPENSE_CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Amount *</label>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={expenseData.amount}
                        onChange={(e) => setExpenseData({ ...expenseData, amount: e.target.value })}
                        className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-rose-200 focus:border-rose-500 transition-all bg-white shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Currency</label>
                      <select
                        value={expenseData.currency}
                        onChange={(e) => setExpenseData({ ...expenseData, currency: e.target.value })}
                        className="cursor-pointer w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-rose-200 bg-white shadow-sm"
                      >
                        {CURRENCIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
                      <input
                        type="date"
                        value={expenseData.date}
                        onChange={(e) => setExpenseData({ ...expenseData, date: e.target.value })}
                        className="cursor-pointer w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-rose-200 focus:border-rose-500 transition-all bg-white shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Payment Method</label>
                      <select
                        value={expenseData.paymentMethod}
                        onChange={(e) => setExpenseData({ ...expenseData, paymentMethod: e.target.value })}
                        className="cursor-pointer w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-rose-200 bg-white shadow-sm"
                      >
                        <option value="cash">Cash</option>
                        <option value="bank">Bank Transfer</option>
                        <option value="upi">UPI</option>
                        <option value="card">Card</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                      <textarea
                        placeholder="Optional notes..."
                        value={expenseData.description}
                        onChange={(e) => setExpenseData({ ...expenseData, description: e.target.value })}
                        rows={1}
                        className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl resize-none focus:ring-4 focus:ring-rose-200 focus:border-rose-500 transition-all bg-white shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleExpense}
                      className="cursor-pointer px-10 py-4 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-bold rounded-xl shadow-2xl transition-all transform hover:scale-105 text-lg"
                    >
                      {editingExpense ? "Update Expense" : "Save Expense"}
                    </button>
                  </div>
                </div>

                {/* Expense List */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-200/50 shadow-xl">
                  <h3 className="text-3xl font-black text-red-700 mb-6 flex items-center justify-between">
                    Recent Expenses
                    <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-lg font-bold">
                      {filteredExpenses.length} {filteredExpenses.length === 1 ? "item" : "items"}
                    </span>
                  </h3>
                  <TransactionList
                    items={filteredExpenses}
                    type="expense"
                    onEdit={startEditExpense}
                    onDelete={deleteExpense}
                    currentPage={expensePage}
                    setCurrentPage={setExpensePage}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showReminderModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowReminderModal(false)} // ← click outside to close
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden border border-gray-200"
            onClick={(e) => e.stopPropagation()} // ← prevent close when clicking inside
          >
            <div className="bg-gradient-to-r from-emerald-600 to-green-700 px-5 py-4 text-white">
              <h3 className="text-lg font-bold">Financial Reminder</h3>
              <p className="text-xs text-emerald-100 mt-1">
                Add a quick note (recommended)
              </p>
            </div>

            <div className="p-5">
              <textarea
                value={tempReminderNote}
                onChange={(e) => setTempReminderNote(e.target.value)}
                placeholder="Reminders, follow-ups, next actions..."
                rows={3}
                className="w-full px-3 py-2.5 text-sm border-2 border-gray-300 rounded-lg resize-y focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 bg-white shadow-sm outline-none min-h-[80px]"
              />
            </div>

            <div className="flex justify-end gap-3 px-5 py-4 border-t bg-gray-50">

              <button
                onClick={() => {
                  setShowReminderModal(false);
                  saveIncome("");  // Explicitly pass empty
                }}
                className="cursor-pointer px-5 py-2 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                Skip
              </button>


              <button
                onClick={() => {
                  const newNote = tempReminderNote.trim();
                  setShowReminderModal(false);
                  saveIncome(newNote);  // Pass the note directly — no state timing issues!
                }}
                className="cursor-pointer px-5 py-2 text-sm bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white rounded-lg font-bold transition-all shadow-sm"
              >
                Save & Continue
              </button>


            </div>
          </div>
        </div>
      )}
    </div>
  );
}



