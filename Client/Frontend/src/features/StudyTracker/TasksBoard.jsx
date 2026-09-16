import React, { useEffect, useState } from "react";
import { useTasksLogic } from "../../Hooks/useTasksLogic";
import { Plus, Clock, Trash2, Edit2, X } from "lucide-react";
import toast from "react-hot-toast";

export default function TasksBoard() {
  const { tasks, loadTasks, addTask, updateTask, removeTask, loading } = useTasksLogic();
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({ title: "", subject: "", priority: "medium", status: "pending", deadline: "" });

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const openModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        subject: task.subject || "",
        priority: task.priority || "medium",
        status: task.status || "pending",
        deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : ""
      });
    } else {
      setEditingTask(null);
      setFormData({ title: "", subject: "", priority: "medium", status: "pending", deadline: "" });
    }
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTask) {
      updateTask(editingTask._id, formData).then(() => setShowModal(false));
    } else {
      addTask(formData).then(() => setShowModal(false));
    }
  };

  const priorities = { low: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" };

  const columns = [
    { id: "pending", title: "Pending" },
    { id: "in-progress", title: "In Progress" },
    { id: "completed", title: "Completed" }
  ];

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 shrink-0">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Tasks Board</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={16} /> New Task
        </button>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-6 min-w-max pb-4 h-full">
          {columns.map(col => (
            <div key={col.id} className="w-80 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 flex flex-col border border-gray-100 dark:border-gray-700/50 h-full">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4 flex justify-between">
                {col.title}
                <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">
                  {tasks?.filter(t => t.status === col.id).length || 0}
                </span>
              </h3>
              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {tasks?.filter(t => t.status === col.id).map(task => (
                  <div key={task._id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group hover:border-violet-300 dark:hover:border-violet-600 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${priorities[task.priority || "medium"]}`}>
                        {task.priority || "medium"}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openModal(task)} className="text-gray-400 hover:text-blue-500"><Edit2 size={14} /></button>
                        <button onClick={() => removeTask(task._id)} className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-100 text-sm mb-1">{task.title}</h4>
                    {task.subject && <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{task.subject}</p>}
                    
                    {task.deadline && (
                      <div className={`flex items-center gap-1 text-xs ${new Date(task.deadline) < new Date() && task.status !== "completed" ? "text-red-500 font-medium" : "text-gray-400"}`}>
                        <Clock size={12} />
                        {new Date(task.deadline).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">{editingTask ? "Edit Task" : "New Task"}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input required type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-violet-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                <input type="text" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-violet-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-violet-500">
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                  <select value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})} className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-violet-500">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deadline</label>
                <input type="date" value={formData.deadline} onChange={(e) => setFormData({...formData, deadline: e.target.value})} className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-violet-500" />
              </div>
              <button disabled={loading} type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white p-3 rounded-xl font-medium transition-colors disabled:opacity-50">
                {loading ? "Saving..." : "Save Task"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
