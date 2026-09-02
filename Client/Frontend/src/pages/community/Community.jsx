import React, { useState, useEffect } from "react";
import { Search, Plus, Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  createCommunityService,
  getAllCommunitiesService,
} from "../../Service/community";
import CreateCommunityModal from "./CommunityModel";
import { setCommunities } from "../../store/CreateSlice";
import CommunityCard from "./CommunityCard";

export default function Community() {
  const dispatch = useDispatch();
  const { communities } = useSelector((state) => state.community);


  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, img: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

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
      <div className="bg-linear-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
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
            Koi community nahi mili.
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

      <CreateCommunityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        newRule={newRule}
        setNewRule={setNewRule}
        previewImage={previewImage}
        categories={categories}
        createLoading={createLoading}
        handleImageChange={handleImageChange}
        handleAddRule={handleAddRule}
        handleRemoveRule={handleRemoveRule}
        handleCreateSubmit={handleCreateSubmit}
      />
    </div>
  );
}
