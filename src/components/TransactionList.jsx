

// src/components/TransactionList.jsx
// import React from "react";

// export default function TransactionList({
//   items,
//   type,
//   onEdit,
//   onDelete,
//   currentPage,
//   setCurrentPage,
//   itemsPerPage = 10,
// }) {
//   const totalPages = Math.ceil(items.length / itemsPerPage);
//   const startIdx = (currentPage - 1) * itemsPerPage;
//   const paginatedItems = items.slice(startIdx, startIdx + itemsPerPage);

//   if (items.length === 0) {
//     return (
//       <p className="text-center text-gray-500 py-12 text-lg">
//         No {type}s yet
//       </p>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       <div className="space-y-3">
//         {paginatedItems.map((item) => (
//           <div
//             key={item._id}
//             className="bg-white rounded-xl shadow-md border p-5 hover:shadow-lg transition-all hover:scale-[1.02]"
//           >
//             {/* Container that wraps properly */}
//             <div className="flex justify-between items-start gap-4 flex-wrap">
              
//               {/* LEFT SIDE */}
//               <div className="flex-1 min-w-[250px]">
//                 <div className="flex items-center gap-3 mb-2">
//                   <h4 className="font-bold text-lg break-all whitespace-pre-wrap">
//                     {item.title}
//                   </h4>

//                   <span
//                     className={`px-3 py-1 rounded-full text-xs font-bold ${
//                       type === "income"
//                         ? "bg-green-100 text-green-700"
//                         : "bg-red-100 text-red-700"
//                     }`}
//                   >
//                     {type.toUpperCase()}
//                   </span>
//                 </div>

//                 <div className="text-sm text-gray-600 space-y-1 break-all whitespace-pre-wrap">
//                   <p>
//                     <strong>Category:</strong> {item.category}
//                   </p>
//                   <p>
//                     <strong>Method:</strong> {item.paymentMethod || "Cash"}
//                   </p>
//                   <p>
//                     <strong>Date:</strong>{" "}
//                     {new Date(item.date).toLocaleDateString("en-IN")}
//                   </p>

//                   {/* DESCRIPTION FIX — FREE TEXT, MULTI-LINE, WRAPS ALWAYS */}
//                   {item.description && (
//                     <p className="italic text-gray-500 mt-2 break-all whitespace-pre-wrap">
//                       "{item.description}"
//                     </p>
//                   )}
//                 </div>

//                 <p
//                   className={`text-2xl font-bold mt-3 ${
//                     type === "income"
//                       ? "text-green-600"
//                       : "text-red-600"
//                   }`}
//                 >
//                   {item.currency === "INR"
//                     ? "₹"
//                     : item.currency === "USD"
//                     ? "$"
//                     : item.currency === "AED"
//                     ? "د.إ"
//                     : item.currency}
//                   {Number(item.amount).toLocaleString("en-IN")}
//                 </p>
//               </div>

//               {/* RIGHT SIDE BUTTONS */}
//               <div className="flex gap-2 flex-shrink-0 mt-3 md:mt-0">
//                 <button
//                   onClick={() => onEdit(item)}
//                   className="cursor-pointer px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => onDelete(item._id)}
//                   className="cursor-pointer px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium"
//                 >
//                   Delete
//                 </button>
//               </div>

//             </div>
//           </div>
//         ))}
//       </div>

//       {/* PAGINATION */}
//       {totalPages > 1 && (
//         <div className="flex justify-center gap-2 mt-6">
//           <button
//             onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//             disabled={currentPage === 1}
//             className={`cursor-pointer px-6 py-2 rounded-lg font-medium ${
//               currentPage === 1
//                 ? "bg-gray-200 text-gray-500"
//                 : "bg-blue-600 text-white hover:bg-blue-700"
//             }`}
//           >
//             Previous
//           </button>

//           <span className="px-4 py-2 bg-gray-100 rounded-lg text-sm">
//             Page {currentPage} of {totalPages}
//           </span>

//           <button
//             onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
//             disabled={currentPage === totalPages}
//             className={`cursor-pointer px-6 py-2 rounded-lg font-medium ${
//               currentPage === totalPages
//                 ? "bg-gray-200 text-gray-500"
//                 : "bg-blue-600 text-white hover:bg-blue-700"
//             }`}
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }


//---------------financial reminder on 31 dec 2025-------------

import React from "react";

export default function TransactionList({
  items,
  type,
  onEdit,
  onDelete,
  currentPage,
  setCurrentPage,
  itemsPerPage = 10,
}) {
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedItems = items.slice(startIdx, startIdx + itemsPerPage);

  if (items.length === 0) {
    return (
      <p className="text-center text-gray-500 py-12 text-lg">
        No {type}s yet
      </p>
    );
  }

  const NEGATIVE_CATEGORIES = ["refund", "chargeback", "void"];

  const isNegativeCategory = (category = "") =>
    NEGATIVE_CATEGORIES.includes(category.toLowerCase());

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {paginatedItems.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-xl shadow-md border p-5 hover:shadow-lg transition-all hover:scale-[1.02]"
          >
            {/* Container that wraps properly */}
            <div className="flex justify-between items-start gap-4 flex-wrap">

              {/* LEFT SIDE */}
              <div className="flex-1 min-w-[250px]">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-bold text-lg break-all whitespace-pre-wrap">
                    {item.title}
                  </h4>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${type === "income"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                      }`}
                  >
                    {type.toUpperCase()}
                  </span>
                </div>

                <div className="text-sm text-gray-600 space-y-1 break-all whitespace-pre-wrap">
                  {/* <p>
                    <strong>Category:</strong> {item.category}
                  </p> */}

                  <p>
                    <strong>Category:</strong>{" "}
                    <span
                      className={`font-semibold ${isNegativeCategory(item.category)
                        ? "text-red-600"
                        : "text-gray-700"
                        }`}
                    >
                      {item.category}
                    </span>
                  </p>

                  <p>
                    <strong>Method:</strong> {item.paymentMethod || "Cash"}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(item.date).toLocaleDateString("en-IN")}
                  </p>

                  {/* DESCRIPTION FIX — FREE TEXT, MULTI-LINE, WRAPS ALWAYS */}
                  {/* Description */}

                  {item.description && (
                    <div className="mt-2">
                      <strong>Description:</strong>
                      <p className="italic text-gray-500 break-all whitespace-pre-wrap">
                        "{item.description}"
                      </p>
                    </div>
                  )}

                  {/* Financial Reminder */}
                  {/* <div className="mt-2">
                    <strong>Financial Reminder:</strong>{" "}
                    {item.financialReminderNote ? (
                      <span className="italic text-gray-600">
                        {item.financialReminderNote}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </div> */}

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h5 className="text-sm font-semibold text-amber-700 mb-1.5">
                      Financial Reminder Note
                    </h5>
                    {item.financialReminderNote && item.financialReminderNote.trim() ? (
                      <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed italic">
                        {item.financialReminderNote}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400 italic">— No reminder added —</p>
                    )}
                  </div>


                </div>

                {/* <p
                  className={`text-2xl font-bold mt-3 ${type === "income"
                    ? "text-green-600"
                    : "text-red-600"
                    }`}
                > */}

                {/* <p
                  className={`text-2xl font-bold mt-3 ${isNegativeCategory(item.category)
                      ? "text-red-600"
                      : type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                >


                  {item.currency === "INR"
                    ? "₹"
                    : item.currency === "USD"
                      ? "$"
                      : item.currency === "AED"
                        ? "د.إ"
                        : item.currency}
                  {Number(item.amount).toLocaleString("en-IN")}
                </p> */}

                <p
                  className={`text-2xl font-bold mt-3 ${isNegativeCategory(item.category)
                      ? "text-red-600"
                      : type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                >
                  {item.currency === "INR"
                    ? "₹"
                    : item.currency === "USD"
                      ? "$"
                      : item.currency === "AED"
                        ? "د.إ"
                        : item.currency}
                  {Number(item.amount).toLocaleString("en-IN")}
                </p>


              </div>

              {/* RIGHT SIDE BUTTONS */}
              <div className="flex gap-2 flex-shrink-0 mt-3 md:mt-0">
                <button
                  onClick={() => onEdit(item)}
                  className="cursor-pointer px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item._id)}
                  className="cursor-pointer px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium"
                >
                  Delete
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`cursor-pointer px-6 py-2 rounded-lg font-medium ${currentPage === 1
              ? "bg-gray-200 text-gray-500"
              : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
          >
            Previous
          </button>

          <span className="px-4 py-2 bg-gray-100 rounded-lg text-sm">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`cursor-pointer px-6 py-2 rounded-lg font-medium ${currentPage === totalPages
              ? "bg-gray-200 text-gray-500"
              : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}


