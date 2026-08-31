import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Sparkles,
  X,
  Upload,
  Layers,
  FileText,
  Tag,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { createCommunityService, getAllCommunitiesService } from "../../Service/community";


export default function Community() {
  const dispatch = useDispatch();
  const { communities } = useSelector((state) => state.community);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  // Form states for Create Modal
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Software Development",
    rules: ["Be collaborative and respectful"],
    tags: "",
    img: null,
  });
  const [newRule, setNewRule] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  // Backend se saari communities fetch karna
  useEffect(() => {
    const fetchCommunities = async () => {
      setLoading(true);
      try {
        const data = await getAllCommunitiesService();
        dispatch(setCommunities(data.communities));
      } catch (error) {
        toast.error(
          error.message || "Communities load karne mein samasya aayi!",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, [dispatch]);

  const categories = [
    "All",
    "Software Development",
    "Computer Science Core",
    "Emerging Tech",
    "Infrastructure",
    "Systems & Security",
    "Competitions",
    "University Study Circle",
  ];

  const q = searchQuery.toLowerCase().trim();

  // Search aur category ke mutabiq filter karna
  const filteredCommunities = communities.filter((c) => {
    if (selectedCategory !== "All" && c.category !== selectedCategory)
      return false;
    if (q) {
      return (
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Image change handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, img: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Rules handlers
  const handleAddRule = () => {
    if (!newRule.trim()) return;
    setFormData((prev) => ({
      ...prev,
      rules: [...prev.rules, newRule.trim()],
    }));
    setNewRule("");
  };

  const handleRemoveRule = (index) => {
    setFormData((prev) => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index),
    }));
  };

  // Submit Handler for Creation
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description) {
      toast.error("Name aur description zaroori hain!");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("category", formData.category);

    const tagsArray = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    tagsArray.forEach((tag) => data.append("tags[]", tag));
    formData.rules.forEach((rule) => data.append("rules[]", rule));

    if (formData.img) {
      data.append("img", formData.img);
    }

    setCreateLoading(true);
    try {
      const response = await createCommunityService(data);
      dispatch(addCommunity(response.community));
      toast.success(
        response.message || "Community successfully launch ho gayi! 🚀",
      );
      setIsCreateModalOpen(false);
      // Reset form
      setFormData({
        name: "",
        description: "",
        category: "Software Development",
        rules: ["Be collaborative and respectful"],
        tags: "",
        img: null,
      });
      setPreviewImage(null);
    } catch (error) {
      toast.error(error.message || "Community create karne mein error aaya!");
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 relative">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-medium mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Learning Communities
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">
            Join Communities. Grow Together.
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            Join focused groups based on technologies, subjects, and study
            tracks. Collaborate, ask questions, and share notes with peers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-600/25 cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Create Community
        </button>
      </div>

      {/* Search & Category Filter Chips */}
      <div className="space-y-3">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-indigo-600 dark:text-indigo-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search communities by name, topic, or tech stack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121826] text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                  : "bg-white dark:bg-[#121826] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid / Loading / Empty States */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="text-xs text-slate-500 font-medium">
            Communities load ho rahi hain... ⏳
          </p>
        </div>
      ) : filteredCommunities.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 dark:bg-[#121826]/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            Koi community nahi mili. 😕
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Pehli community khud create karein aur doston ko jodein!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCommunities.map((community) => (
            <CommunityCard
              key={community._id || community.id}
              community={community}
            />
          ))}
        </div>
      )}

      {/* --- INLINE CREATE COMMUNITY MODAL --- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#121826] border border-slate-200/80 dark:border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 p-6 text-white relative flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
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
                      <option
                        key={cat}
                        value={cat}
                        className="dark:bg-[#121826]"
                      >
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
                  onClick={() => setIsCreateModalOpen(false)}
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
      )}
    </div>
  );
}
