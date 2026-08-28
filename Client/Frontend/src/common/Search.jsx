import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import {
  Search,
  Users,
  HelpCircle,
  FileText,
  Bookmark,
  Hash,
  ArrowRight,
  X,
  Flame,
} from "lucide-react";

import {
  setIsSearchModalOpen,
  selectSearchModalOpen,
  selectStudents,
  selectDoubts,
  selectCommunities,
  selectResources,
} from "../store/CreateSlice";

export default function SearchModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isSearchModalOpen = useSelector(selectSearchModalOpen);
  const students = useSelector(selectStudents);
  const doubts = useSelector(selectDoubts);
  const posts = useSelector((state) => state.post?.userPosts || []);
  const communities = useSelector(selectCommunities);
  const resources = useSelector(selectResources);

  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // 'all' | 'students' | 'doubts' | 'posts' | 'communities' | 'resources'
  const inputRef = useRef(null);

  // useEffect jo modal khulne par input ko focus karega aur band hone par reset karega
  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setActiveFilter("all");
    }
  }, [isSearchModalOpen]);

  const trendingSearches = [
    "Dynamic Programming",
    "React 19 Actions",
    "PostgreSQL Indexing",
    "Dijkstra Algorithm",
    "Sara Khan",
    "System Design",
  ];

  // Filtering Logic
  const trimmed = query.trim().toLowerCase();

  const filteredStudents = trimmed
    ? students.filter(
        (s) =>
          s.name?.toLowerCase().includes(trimmed) ||
          s.username?.toLowerCase().includes(trimmed) ||
          s.skills?.some((sk) => sk.toLowerCase().includes(trimmed)),
      )
    : [];

  const filteredDoubts = trimmed
    ? doubts.filter(
        (d) =>
          d.title?.toLowerCase().includes(trimmed) ||
          d.description?.toLowerCase().includes(trimmed) ||
          d.subject?.toLowerCase().includes(trimmed) ||
          d.tags?.some((t) => t.toLowerCase().includes(trimmed)),
      )
    : [];

  const filteredPosts = trimmed
    ? posts.filter(
        (p) =>
          p.content?.toLowerCase().includes(trimmed) ||
          p.subject?.toLowerCase().includes(trimmed) ||
          p.tags?.some((t) => t.toLowerCase().includes(trimmed)),
      )
    : [];

  const filteredCommunities = trimmed
    ? communities.filter(
        (c) =>
          c.name?.toLowerCase().includes(trimmed) ||
          c.description?.toLowerCase().includes(trimmed) ||
          c.tags?.some((t) => t.toLowerCase().includes(trimmed)),
      )
    : [];

  const filteredResources = trimmed
    ? resources.filter(
        (r) =>
          r.title?.toLowerCase().includes(trimmed) ||
          r.subject?.toLowerCase().includes(trimmed) ||
          r.tags?.some((t) => t.toLowerCase().includes(trimmed)),
      )
    : [];

  const hasResults =
    filteredStudents.length > 0 ||
    filteredDoubts.length > 0 ||
    filteredPosts.length > 0 ||
    filteredCommunities.length > 0 ||
    filteredResources.length > 0;

  const handleSelect = (type, item) => {
    dispatch(setIsSearchModalOpen(false));
    if (type === "student") navigate(`/profile/${item.username}`);
    if (type === "doubt") navigate(`/doubts/${item.id}`);
    if (type === "community") navigate(`/communities/${item.id}`);
    if (type === "post") navigate(`/home`);
    if (type === "resource") navigate(`/resources`);
  };

  return (
    <AnimatePresence>
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:pt-20 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(setIsSearchModalOpen(false))}
            className="fixed inset-0  dark:bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-white dark:bg-surface-darkCard border border-slate-200 dark:border-surface-darkBorder rounded-3xl shadow-2xl overflow-hidden z-10"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-5 py-4 border-b border-slate-100 dark:border-surface-darkBorder">
              <Search className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search students, doubts, communities, posts, resources..."
                className="w-full pl-3 pr-4 bg-transparent text-sm sm:text-base text-ink dark:text-slate-100 placeholder-ink-faint focus:outline-none"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="p-1 rounded-full text-ink-faint hover:text-ink dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-block text-[11px] font-mono px-2 py-1 bg-slate-100 dark:bg-surface-darkBorder rounded-lg text-ink-faint">
                  ESC
                </kbd>
              )}
            </div>

            {/* Filter Pills */}
            {query && (
              <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 dark:bg-surface-darkBorder/40 border-b border-slate-100 dark:border-surface-darkBorder overflow-x-auto scrollbar-none">
                {[
                  "all",
                  "students",
                  "doubts",
                  "communities",
                  "resources",
                  "posts",
                ].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setActiveFilter(f)}
                    className={`text-xs px-3 py-1 rounded-full font-semibold capitalize transition-colors whitespace-nowrap ${
                      activeFilter === f
                        ? "bg-ink text-white dark:bg-slate-100 dark:text-ink"
                        : "bg-white dark:bg-surface-darkCard text-ink-soft dark:text-slate-400 hover:text-ink border border-slate-200 dark:border-surface-darkBorder"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}

            {/* Results / Suggestions Container */}
            <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-5">
              {!query ? (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-ink-faint dark:text-slate-400 uppercase tracking-wider mb-3">
                    <Flame className="w-4 h-4 text-amber-500" />
                    Trending Searches
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {trendingSearches.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setQuery(term)}
                        className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-surface-darkBorder text-xs font-medium text-ink-soft dark:text-slate-300 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950/60 dark:hover:text-brand-300 transition-colors flex items-center gap-1.5"
                      >
                        <Search className="w-3 h-3" />
                        {term}
                      </button>
                    ))}
                  </div>

                  <div className="text-xs font-bold text-ink-faint dark:text-slate-400 uppercase tracking-wider mb-3">
                    Quick Navigation
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      {
                        label: "Doubts & Q&A",
                        icon: <HelpCircle className="w-4 h-4" />,
                        path: "/doubts",
                      },
                      {
                        label: "Communities",
                        icon: <Users className="w-4 h-4" />,
                        path: "/communities",
                      },
                      {
                        label: "Study Tracker",
                        icon: <Flame className="w-4 h-4 text-amber-500" />,
                        path: "/tracker",
                      },
                      {
                        label: "Resources",
                        icon: <FileText className="w-4 h-4" />,
                        path: "/resources",
                      },
                    ].map((nav) => (
                      <button
                        key={nav.label}
                        type="button"
                        onClick={() => {
                          dispatch(setIsSearchModalOpen(false));
                          navigate(nav.path);
                        }}
                        className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-surface-darkBorder/50 hover:bg-brand-50 dark:hover:bg-brand-950/50 hover:text-brand-600 dark:hover:text-brand-300 text-xs font-semibold text-ink-soft dark:text-slate-300 transition-colors text-left"
                      >
                        {nav.icon}
                        <span>{nav.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : hasResults ? (
                <div className="space-y-5">
                  {/* Students */}
                  {(activeFilter === "all" || activeFilter === "students") &&
                    filteredStudents.length > 0 && (
                      <div>
                        <div className="text-[11px] font-bold text-ink-faint uppercase tracking-wider mb-2">
                          Students ({filteredStudents.length})
                        </div>
                        <div className="space-y-1.5">
                          {filteredStudents.map((s) => (
                            <div
                              key={s.id || s._id}
                              onClick={() => handleSelect("student", s)}
                              className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-surface-darkBorder/60 cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={
                                    s.avatar ||
                                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                                  }
                                  alt={s.name}
                                  onError={(e) => {
                                    e.target.src =
                                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";
                                  }}
                                  className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-surface-darkBorder flex-shrink-0"
                                />
                                <div>
                                  <h5 className="text-sm font-semibold text-ink dark:text-slate-100">
                                    {s.name}
                                  </h5>
                                  <p className="text-xs text-ink-faint">
                                    @{s.username} {s.badge && `· ${s.badge}`}
                                  </p>
                                </div>
                              </div>
                              <ArrowRight className="w-4 h-4 text-ink-faint" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Doubts */}
                  {(activeFilter === "all" || activeFilter === "doubts") &&
                    filteredDoubts.length > 0 && (
                      <div>
                        <div className="text-[11px] font-bold text-ink-faint uppercase tracking-wider mb-2">
                          Doubts & Questions ({filteredDoubts.length})
                        </div>
                        <div className="space-y-1.5">
                          {filteredDoubts.map((d) => (
                            <div
                              key={d.id || d._id}
                              onClick={() => handleSelect("doubt", d)}
                              className="p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-surface-darkBorder/60 cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <Badge
                                  variant={
                                    d.status === "solved"
                                      ? "success"
                                      : "warning"
                                  }
                                  size="sm"
                                >
                                  {d.status === "solved"
                                    ? "Solved"
                                    : "Open Doubt"}
                                </Badge>
                                <span className="text-xs text-ink-faint">
                                  {d.subject}
                                </span>
                              </div>
                              <h5 className="text-sm font-semibold text-ink dark:text-slate-100 line-clamp-1">
                                {d.title}
                              </h5>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Posts */}
                  {(activeFilter === "all" || activeFilter === "posts") &&
                    filteredPosts.length > 0 && (
                      <div>
                        <div className="text-[11px] font-bold text-ink-faint uppercase tracking-wider mb-2">
                          Posts ({filteredPosts.length})
                        </div>
                        <div className="space-y-1.5">
                          {filteredPosts.map((p) => (
                            <div
                              key={p.id || p._id}
                              onClick={() => handleSelect("post", p)}
                              className="p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-surface-darkBorder/60 cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="brand" size="sm">
                                  {p.subject || "Post"}
                                </Badge>
                              </div>
                              <p className="text-sm text-ink dark:text-slate-100 line-clamp-2">
                                {p.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Communities */}
                  {(activeFilter === "all" || activeFilter === "communities") &&
                    filteredCommunities.length > 0 && (
                      <div>
                        <div className="text-[11px] font-bold text-ink-faint uppercase tracking-wider mb-2">
                          Communities ({filteredCommunities.length})
                        </div>
                        <div className="space-y-1.5">
                          {filteredCommunities.map((c) => (
                            <div
                              key={c.id || c._id}
                              onClick={() => handleSelect("community", c)}
                              className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-surface-darkBorder/60 cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-brand-100 dark:bg-brand-950 text-brand-600 flex items-center justify-center font-bold text-xs">
                                  {c.iconSvg || <Hash className="w-4 h-4" />}
                                </div>
                                <div>
                                  <h5 className="text-sm font-semibold text-ink dark:text-slate-100">
                                    {c.name}
                                  </h5>
                                  <p className="text-xs text-ink-faint">
                                    {c.membersCount?.toLocaleString() || 0}{" "}
                                    members
                                  </p>
                                </div>
                              </div>
                              <Badge
                                variant={c.isJoined ? "brand" : "outline"}
                                size="sm"
                              >
                                {c.isJoined ? "Joined" : "Explore"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Resources */}
                  {(activeFilter === "all" || activeFilter === "resources") &&
                    filteredResources.length > 0 && (
                      <div>
                        <div className="text-[11px] font-bold text-ink-faint uppercase tracking-wider mb-2">
                          Resources & Notes ({filteredResources.length})
                        </div>
                        <div className="space-y-1.5">
                          {filteredResources.map((r) => (
                            <div
                              key={r.id || r._id}
                              onClick={() => handleSelect("resource", r)}
                              className="p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-surface-darkBorder/60 cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="brand" size="sm">
                                  {r.fileType || "File"}
                                </Badge>
                                <span className="text-xs text-ink-faint">
                                  {r.subject}
                                </span>
                              </div>
                              <h5 className="text-sm font-semibold text-ink dark:text-slate-100 line-clamp-1">
                                {r.title}
                              </h5>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-base font-semibold text-ink dark:text-slate-200">
                    No results found for "{query}"
                  </p>
                  <p className="text-xs text-ink-faint mt-1">
                    Try searching by topic, subject tag, student name or
                    community
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
