// src/pages/GuestDashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { FiLogOut, FiEye } from 'react-icons/fi';

const GuestDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        let res;
        // METHOD 1: Guest-specific route (BEST)
        try {
          res = await api.get('/projects/guest');
        } catch {
          // METHOD 2: Fallback to normal route
          res = await api.get('/projects');
        }

        const projectsList = res.data.projects || res.data || [];
        setProjects(projectsList);

        if (projectsList.length === 0) {
          setError("No projects available to view");
        } else if (projectsList.length === 1) {
          // Auto redirect if only one project
          navigate(`/guestView/${projectsList[0]._id}`);
        }
      } catch (err) {
        setError("Unable to load projects. Please contact admin.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [navigate]);

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-4xl font-black text-indigo-600 animate-pulse">
          Loading Projects...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <header className="fixed top-0 w-full bg-gradient-to-r from-indigo-700 to-purple-800 text-white shadow-2xl z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-3xl font-black">FareBuzzer Guest Portal</h1>
          <button onClick={logout} className="cursor-pointer bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2">
            Logout
          </button>
        </div>
      </header>

      <div className="pt-32 px-6 pb-20 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-black text-gray-800 mb-4">Welcome, Guest</h2>
          <p className="text-xl text-gray-600">Select a project to view financial details</p>
        </div>

        {error && (
          <div className="text-center py-20">
            <p className="text-3xl text-red-600 font-bold mb-4">No Projects Available</p>
            <p className="text-xl text-gray-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((project) => (
            <div
              key={project._id}
              onClick={() => navigate(`/guestView/${project._id}`)}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer border-4 border-transparent hover:border-indigo-500"
            >
              <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-10 text-white">
                <h3 className="text-3xl font-black mb-3">{project.name}</h3>
                <p className="text-indigo-100 text-lg">
                  {project.description || "No description"}
                </p>
              </div>
              <div className="p-8 text-center">
                <FiEye className="text-6xl text-indigo-600 mx-auto mb-4" />
                <button className="cursor-pointer w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-black py-5 rounded-xl text-xl">
                  View Project
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuestDashboard;