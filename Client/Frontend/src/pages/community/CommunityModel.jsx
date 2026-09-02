import React from "react";
import {
  X,
  Upload,
  Layers,
  FileText,
  Tag,
  ShieldCheck,
  Trash2,
  Sparkles,
} from "lucide-react";

export default function CreateCommunityModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  newRule,
  setNewRule,
  previewImage,
  categories,
  createLoading,
  handleImageChange,
  handleAddRule,
  handleRemoveRule,
  handleCreateSubmit,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#121826] border border-slate-200/80 dark:border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 p-6 text-white relative flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md cursor-pointer transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-medium mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            New Hub Launch
          </div>

          <h3 className="text-xl font-extrabold tracking-tight">
            Create Learning Community
          </h3>
          <p className="text-slate-300 text-xs mt-1">
            Apna study group banayein, peers ke sath connect karein aur sath
            milkar grow karein.
          </p>
        </div>

        {/* Modal Form */}
        <form
          onSubmit={handleCreateSubmit}
          className="p-6 space-y-4 overflow-y-auto flex-1"
        >
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Community Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Full Stack Wizards"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#1a2234] text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows="3"
              placeholder="Yeh community kis baare mein hai..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#1a2234] text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none transition-all"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#1a2234] text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer transition-all"
            >
              {categories
                .filter((c) => c !== "All")
                .map((cat) => (
                  <option key={cat} value={cat} className="dark:bg-[#121826]">
                    {cat}
                  </option>
                ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Community Banner Image
            </label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-4 cursor-pointer hover:border-indigo-600 dark:hover:border-indigo-500 transition-all bg-slate-50/50 dark:bg-[#1a2234] group">
              {previewImage ? (
                <div className="relative w-full h-24 rounded-xl overflow-hidden">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-medium">
                    Change Image
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Click to upload banner image
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Tag className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Tags (Comma separated)
            </label>
            <input
              type="text"
              placeholder="React, Node, Tailwind"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#1a2234] text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Community Rules
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Naya rule add karein..."
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#1a2234] text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddRule}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 cursor-pointer"
              >
                Add
              </button>
            </div>

            <ul className="space-y-1.5 max-h-28 overflow-y-auto mt-2">
              {formData.rules.map((rule, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between text-xs bg-slate-50 dark:bg-[#1a2234] border border-slate-200/60 dark:border-slate-800/60 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300"
                >
                  <span className="font-medium">
                    {index + 1}. {rule}
                  </span>
                  {formData.rules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRule(index)}
                      className="text-red-500 hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createLoading}
              className="flex-1 px-4 py-3 rounded-2xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {createLoading ? "Launching..." : "Launch Community 🚀"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
