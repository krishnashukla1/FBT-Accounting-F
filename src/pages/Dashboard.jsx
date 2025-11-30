// src/pages/Dashboard.jsx
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api";

// export default function Dashboard() {
//   const [loading, setLoading] = useState(true);
//   const [showCreate, setShowCreate] = useState(false);
//   const [projects, setProjects] = useState([]);

//   // create fields
//   const [name, setName] = useState("");
//   const [desc, setDesc] = useState("");

//   // edit fields
//   const [showEdit, setShowEdit] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [editName, setEditName] = useState("");
//   const [editDesc, setEditDesc] = useState("");

//   const navigate = useNavigate();

//   useEffect(() => {
//     loadProjects();
//   }, []);

//   const loadProjects = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get("/projects");
//       if (res.data.success) setProjects(res.data.projects);
//     } catch (err) {
//       console.error("Error loading projects:", err);
//     }
//     setLoading(false);
//   };

//   const createProject = async () => {
//     if (!name.trim()) {
//       alert("Project name is required");
//       return;
//     }

//     try {
//       const res = await api.post("/projects", {
//         name: name.trim(),
//         description: desc.trim(),
//       });

//       if (res.data.success) {
//         setShowCreate(false);
//         setName("");
//         setDesc("");
//         loadProjects();
//       }
//     } catch (err) {
//       console.error("Error creating project:", err);
//       alert("Failed to create project");
//     }
//   };

//   // open edit modal
//   const openEditModal = (project) => {
//     setEditId(project._id);
//     setEditName(project.name);
//     setEditDesc(project.description || "");
//     setShowEdit(true);
//   };

//   // update project
//   const updateProject = async () => {
//     if (!editName.trim()) {
//       alert("Project name is required");
//       return;
//     }

//     try {
//       const res = await api.put(`/projects/${editId}`, {
//         name: editName.trim(),
//         description: editDesc.trim(),
//       });

//       if (res.data.success) {
//         setShowEdit(false);
//         loadProjects();
//       }
//     } catch (err) {
//       console.error("Error updating project:", err);
//       alert("Failed to update project");
//     }
//   };

//   const deleteProject = async (projectId, projectName) => {
//     if (
//       !confirm(
//         `Are you sure you want to delete "${projectName}"? This action cannot be undone.`
//       )
//     ) {
//       return;
//     }

//     try {
//       const res = await api.delete(`/projects/${projectId}`);
//       if (res.data.success) {
//         loadProjects();
//       }
//     } catch (err) {
//       console.error("Error deleting project:", err);
//       alert("Failed to delete project");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100/30">
//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {/* ENHANCED HEADER */}
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
//           <div className="mb-6 lg:mb-0">
//             <div className="flex items-center gap-4 mb-4">
//               <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-lg">
//                 <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
//                 </svg>
//               </div>
//               <div>
//                 <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//                   Projects Dashboard
//                 </h1>
//                 <p className="text-gray-600 mt-2 text-lg">
//                   Manage your financial projects and track income & expenses
//                 </p>
//               </div>
//             </div>
//           </div>

//           <button
//             onClick={() => setShowCreate(true)}
//             className="group cursor-pointer flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border-2 border-white/20"
//           >
//             <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//             </svg>
//             <span className="text-lg">New Project</span>
//           </button>
//         </div>

//         {/* ENHANCED PROJECT LIST SECTION */}
//         <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8">
//           {/* SECTION HEADER */}
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
//             <div>
//               <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
//                 <span>Your Projects</span>
//                 <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-4 py-2 rounded-full text-sm font-bold">
//                   {projects.length} project{projects.length !== 1 ? "s" : ""}
//                 </span>
//               </h2>
//               <p className="text-gray-600 mt-2">Click on any project to manage finances</p>
//             </div>
            
//             {projects.length > 0 && (
//               <div className="flex items-center gap-4 mt-4 sm:mt-0">
//                 <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-xl">
//                   Last updated: {new Date().toLocaleTimeString()}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* LOADER */}
//           {loading ? (
//             <div className="flex flex-col items-center justify-center py-16">
//               <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
//               <p className="text-gray-600 text-lg">Loading your projects...</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
//               {projects.length === 0 ? (
//                 <div className="col-span-full text-center bg-gradient-to-br from-gray-50 to-blue-50/50 p-12 rounded-2xl border-2 border-dashed border-gray-300">
//                   <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
//                     <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
//                     </svg>
//                   </div>
//                   <h3 className="text-2xl font-bold text-gray-900 mb-3">No projects yet</h3>
//                   <p className="text-gray-600 mb-8 max-w-md mx-auto">
//                     Create your first project to start tracking income and expenses across multiple currencies.
//                   </p>
//                   <button
//                     onClick={() => setShowCreate(true)}
//                     className="cursor-pointer px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105"
//                   >
//                     Create Your First Project
//                   </button>
//                 </div>
//               ) : (
//                 projects.map((project) => (
//                   <div
//                     key={project._id}
//                     className="group bg-gradient-to-br from-white to-blue-50/50 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
//                   >
//                     <div className="p-6">
//                       {/* PROJECT HEADER */}
//                       <div className="flex items-start justify-between mb-4">
//                         <div className="flex-1 min-w-0">
//                           <h3 className="text-xl font-black text-gray-900 truncate group-hover:text-blue-600 transition-colors">
//                             {project.name}
//                           </h3>
//                           <div className="flex items-center gap-2 mt-1">
//                             <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                             <span className="text-xs text-gray-500">Active</span>
//                           </div>
//                         </div>
//                         <div className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
//                           #{project._id.slice(-6)}
//                         </div>
//                       </div>

//                       {/* PROJECT DESCRIPTION */}
//                       <div className="mb-6">
//                         <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 min-h-[60px]">
//                           {project.description || (
//                             <span className="text-gray-400 italic">No description provided</span>
//                           )}
//                         </p>
//                       </div>

//                       {/* PROJECT META */}
//                       <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
//                         <div className="flex items-center gap-2">
//                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                           </svg>
//                           <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
//                         </div>
//                       </div>

//                       {/* ACTION BUTTONS */}
//                       <div className="flex gap-3">
//                         {/* OPEN BUTTON */}
//                         <button
//                           // onClick={() => navigate(`/projects/${project._id}`)}
                          
//                           onClick={() => navigate(`/project/${project._id}`)}

//                           className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 group/open"
//                         >
//                           <span>Open Project</span>
//                           <svg className="w-4 h-4 group-hover/open:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                           </svg>
//                         </button>

//                         {/* ACTION BUTTONS */}
//                         <div className="flex gap-2">
//                           {/* EDIT BUTTON */}
//                           <button
//                             onClick={() => openEditModal(project)}
//                             className="cursor-pointer p-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl shadow-lg transition-all duration-300 transform hover:scale-110 hover:shadow-xl"
//                             title="Edit Project"
//                           >
//                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                             </svg>
//                           </button>

//                           {/* DELETE BUTTON */}
//                           <button
//                             onClick={() => deleteProject(project._id, project.name)}
//                             className="cursor-pointer p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg transition-all duration-300 transform hover:scale-110 hover:shadow-xl"
//                             title="Delete Project"
//                           >
//                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                             </svg>
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ENHANCED CREATE PROJECT MODAL */}
//       {showCreate && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
//             <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-3xl">
//               <h3 className="text-2xl font-black text-white flex items-center gap-3">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                 </svg>
//                 Create New Project
//               </h3>
//             </div>

//             <div className="p-6 space-y-6">
//               <div>
//                 <label className="block text-sm font-bold text-gray-700 mb-3">Project Name *</label>
//                 <input
//                   type="text"
//                   className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 bg-white/80"
//                   placeholder="Enter project name..."
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   autoFocus
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-bold text-gray-700 mb-3">Description</label>
//                 <textarea
//                   rows="4"
//                   className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 bg-white/80 resize-none"
//                   placeholder="Project description (optional)..."
//                   value={desc}
//                   onChange={(e) => setDesc(e.target.value)}
//                 ></textarea>
//               </div>
//             </div>

//             <div className="flex justify-end gap-4 p-6 border-t border-gray-200">
//               <button
//                 onClick={() => setShowCreate(false)}
//                 className="cursor-pointer px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={createProject}
//                 className="cursor-pointer px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
//               >
//                 Create Project
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ENHANCED EDIT PROJECT MODAL */}
//       {showEdit && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
//             <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-6 rounded-t-3xl">
//               <h3 className="text-2xl font-black text-white flex items-center gap-3">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                 </svg>
//                 Edit Project
//               </h3>
//             </div>

//             <div className="p-6 space-y-6">
//               <div>
//                 <label className="block text-sm font-bold text-gray-700 mb-3">Project Name *</label>
//                 <input
//                   type="text"
//                   className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300 bg-white/80"
//                   value={editName}
//                   onChange={(e) => setEditName(e.target.value)}
//                   autoFocus
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-bold text-gray-700 mb-3">Description</label>
//                 <textarea
//                   rows="4"
//                   className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300 bg-white/80 resize-none"
//                   value={editDesc}
//                   onChange={(e) => setEditDesc(e.target.value)}
//                 ></textarea>
//               </div>
//             </div>

//             <div className="flex justify-end gap-4 p-6 border-t border-gray-200">
//               <button
//                 onClick={() => setShowEdit(false)}
//                 className="cursor-pointer px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={updateProject}
//                 className="cursor-pointer px-8 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
//               >
//                 Update Project
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

//===================================new=======

// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";


export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [projects, setProjects] = useState([]);

  // Password change states
  const [showChangePass, setShowChangePass] = useState(false);
  const [targetUserId, setTargetUserId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);



  // Create project fields
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  // Edit project fields
  const [showEdit, setShowEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get("/projects");
      if (res.data.success) {
        setProjects(res.data.projects);
      }
    } catch (err) {
      console.error("Error loading projects:", err);
      alert("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const createProject = async () => {
    if (!name.trim()) {
      alert("Project name is required");
      return;
    }

    try {
      const res = await api.post("/projects", {
        name: name.trim(),
        description: desc.trim(),
      });

      if (res.data.success) {
        setShowCreate(false);
        setName("");
        setDesc("");
        loadProjects();
      }
    } catch (err) {
      console.error("Error creating project:", err);
      alert("Failed to create project");
    }
  };

  const openEditModal = (project) => {
    setEditId(project._id);
    setEditName(project.name);
    setEditDesc(project.description || "");
    setShowEdit(true);
  };

  const updateProject = async () => {
    if (!editName.trim()) {
      alert("Project name is required");
      return;
    }

    try {
      const res = await api.put(`/projects/${editId}`, {
        name: editName.trim(),
        description: editDesc.trim(),
      });

      if (res.data.success) {
        setShowEdit(false);
        loadProjects();
      }
    } catch (err) {
      console.error("Error updating project:", err);
      alert("Failed to update project");
    }
  };

  const deleteProject = async (projectId, projectName) => {
    if (!confirm(`Are you sure you want to delete "${projectName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await api.delete(`/projects/${projectId}`);
      if (res.data.success) {
        loadProjects();
      }
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Failed to delete project");
    }
  };

  const changePasswordNow = async () => {
    const email = targetUserId.trim(); // now this holds the EMAIL
    if (!email || !newPassword.trim()) {
      alert("Both email and new password are required!");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    if (newPassword.trim().length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    try {
      const res = await api.put(`/auth/change-password/by-email/${encodeURIComponent(email)}`, {
        newPassword: newPassword.trim(),
      });

      if (res.data.success) {
        alert(res.data.message || "Password updated successfully!");
        setShowChangePass(false);
        setTargetUserId("");
        setNewPassword("");
      }
    } catch (err) {
      console.error("Password change error:", err);
      const errorMsg = err.response?.data?.message || "Failed to update password";
      alert(errorMsg);
    }
  };





  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100/30">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12 gap-6">
          <div className="mb-6 lg:mb-0">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Projects Dashboard
                </h1>
                <p className="text-gray-600 mt-2 text-lg">
                  Manage your financial projects and track income & expenses
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowCreate(true)}
              className="group cursor-pointer flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border-2 border-white/20"
            >
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-lg">New Project</span>
            </button>

            <button
              onClick={() => setShowChangePass(true)}
              className="cursor-pointer px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg transition-all"
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Projects List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                <span>Your Projects</span>
                <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-4 py-2 rounded-full text-sm font-bold">
                  {projects.length} project{projects.length !== 1 ? "s" : ""}
                </span>
              </h2>
              <p className="text-gray-600 mt-2">Click on any project to manage finances</p>
            </div>
            {projects.length > 0 && (
              <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-xl mt-4 sm:mt-0">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
              <p className="text-gray-600 text-lg">Loading your projects...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {projects.length === 0 ? (
                <div className="col-span-full text-center bg-gradient-to-br from-gray-50 to-blue-50/50 p-12 rounded-2xl border-2 border-dashed border-gray-300">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No projects yet</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Create your first project to start tracking income and expenses across multiple currencies.
                  </p>
                  <button
                    onClick={() => setShowCreate(true)}
                    className="cursor-pointer px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Create Your First Project
                  </button>
                </div>
              ) : (
                projects.map((project) => (
                  <div
                    key={project._id}
                    className="group bg-gradient-to-br from-white to-blue-50/50 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-black text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                            {project.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-gray-500">Active</span>
                          </div>
                        </div>
                        <div className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                          #{project._id.slice(-6)}
                        </div>
                      </div>

                      <div className="mb-6">
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 min-h-[60px]">
                          {project.description || <span className="text-gray-400 italic">No description provided</span>}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => navigate(`/project/${project._id}`)}
                          className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                          <span>Open Project</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>

                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(project)}
                            className="cursor-pointer p-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl shadow-lg transition-all duration-300 transform hover:scale-110"
                            title="Edit Project"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>

                          <button
                            onClick={() => deleteProject(project._id, project.name)}
                            className="cursor-pointer p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg transition-all duration-300 transform hover:scale-110"
                            title="Delete Project"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePass && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Change User Password</h2>

            {/* <label className="block mb-2 text-sm font-semibold text-gray-700">User ID</label>
            <input
              type="text"
              placeholder="Enter user ID"
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              className="w-full px-4 py-3 mb-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            /> */}

            {/* Inside your Change Password Modal */}
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              User Email
            </label>
            <input
              type="email"
              placeholder="Enter user email (e.g. john@example.com)"
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              className="w-full px-4 py-3 mb-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              autoComplete="off"
            />


            <div className="relative">
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />

              {/* Eye Icon Toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer absolute right-3 top-10 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  // Eye Open (Visible)
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  // Eye Closed (Hidden)
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                )}
              </button>
            </div>

            <div className="flex justify-end gap-4 mt-5">
              <button
                onClick={() => {
                  setShowChangePass(false);
                  setTargetUserId("");
                  setNewPassword("");
                }}
                className="cursor-pointer px-5 py-2 rounded-xl bg-gray-300 hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={changePasswordNow}
                className="cursor-pointer px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg transition"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-3xl">
              <h3 className="text-2xl font-black text-white flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Project
              </h3>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Project Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter project name..."
                  autoFocus
                  className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Description</label>
                <textarea
                  rows="4"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Project description (optional)..."
                  className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowCreate(false)}
                className="cursor-pointer px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={createProject}
                className="cursor-pointer px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transition transform hover:scale-105"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-6 rounded-t-3xl">
              <h3 className="text-2xl font-black text-white flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Project
              </h3>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Project Name *</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  autoFocus
                  className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Description</label>
                <textarea
                  rows="4"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowEdit(false)}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={updateProject}
                className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg transition transform hover:scale-105"
              >
                Update Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}