import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import {
  FileText,
  HelpCircle,
  FolderPlus,
  Flame,
  Image as ImageIcon,
  Code,
  X,
  Copy,
  Check,
  UploadCloud,
  FileType2,
} from "lucide-react";
import {
  selectCreateModalOpen,
  setIsCreateModalOpen,
} from "../store/CreateSlice";

const CHAR_LIMIT = 1000;
const RESOURCE_ACCEPT = ".pdf,image/*";

function formatBytes(bytes) {
  if (!bytes) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export default function CreatePostModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectCreateModalOpen);

  const [createModalTab, setCreateModalTab] = useState("post");
  const [showCodeSnippet, setShowCodeSnippet] = useState(false);

  // --- SCHEMA ACCORDING STATES ---
  const [status, setStatus] = useState("post");
  const [description, setDescription] = useState("");
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionExplanation, setQuestionExplanation] = useState("");
  const [subject, setSubject] = useState("Data Structures & Algorithms");

  const [codeDetails, setCodeDetails] = useState("");
  const [codeType, setCodeType] = useState("JavaScript");
  const [caption, setCaption] = useState("");

  const [copied, setCopied] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Resource tab specific states
  const [resourceFile, setResourceFile] = useState(null);
  const resourceInputRef = useRef(null);

  const handleClose = () => {
    dispatch(setIsCreateModalOpen(false));
  };

  useEffect(() => {
    if (isOpen) {
      setCreateModalTab("post");
      setStatus("post");
      setShowCodeSnippet(false);
      setDescription("");
      setQuestionTitle("");
      setQuestionExplanation("");
      setCodeDetails("");
      setCodeType("JavaScript");
      setCaption("");
      setSubject("Data Structures & Algorithms");
      setImagePreview(null);
      setResourceFile(null);
    }
  }, [isOpen]);

  const handleTabChange = (tabId) => {
    setCreateModalTab(tabId);
    if (tabId === "post") setStatus("post");
    else if (tabId === "doubt") setStatus("doubt");
    else if (tabId === "resource") setStatus("resource");
    else if (tabId === "study") setStatus("study update");
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const handleImagePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleCopyCode = async () => {
    if (!codeDetails) return;
    try {
      await navigator.clipboard.writeText(codeDetails);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const setResourceFromFile = (file) => {
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    const reader = new FileReader();
    reader.onload = () => {
      setResourceFile({
        name: file.name,
        size: file.size,
        type: file.type,
        preview: isImage ? reader.result : null,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleResourceInputChange = (e) => {
    setResourceFromFile(e.target.files?.[0]);
  };

  const handleResourceDrop = (e) => {
    e.preventDefault();
    setResourceFromFile(e.dataTransfer.files?.[0]);
  };

  const handlePreparePost = () => {
    const finalPostData = {
      status,
      description,
      questionTitle,
      questionExplanation,
      subject,
      codeDetails,
      codeType,
      caption,
      img: imagePreview,
      pdf: resourceFile ? resourceFile.name : null,
    };

    console.log("Schema Matched Payload for API:", finalPostData);
    dispatch(setIsCreateModalOpen(false));
  };

  const tabs = [
    { id: "post", label: "Post", icon: <FileText className="w-4 h-4" /> },
    { id: "doubt", label: "Doubt", icon: <HelpCircle className="w-4 h-4" /> },
    {
      id: "resource",
      label: "Resource",
      icon: <FolderPlus className="w-4 h-4" />,
    },
    { id: "study", label: "Update", icon: <Flame className="w-4 h-4" /> },
  ];

  const subjects = [
    "Data Structures & Algorithms",
    "Web Development",
    "AI & Machine Learning",
    "Database Management Systems",
    "Computer Networks & Security",
    "Cloud & DevOps",
    "Competitive Programming",
    "General Computer Science",
    "other",
  ];

  const placeholderText =
    createModalTab === "doubt"
      ? "Explain what you've tried so far, what you expected, and what actually happened..."
      : createModalTab === "study"
        ? "What did you learn today? Share a concept breakdown, a small win, or a blocker..."
        : "Share a concept breakdown, insight, or question with the community...";

  const submitLabel =
    createModalTab === "doubt"
      ? "Post Doubt"
      : createModalTab === "resource"
        ? "Share Resource"
        : "Publish Post";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed  inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          {/* Modal / Sheet */}
          <motion.div
            initial={{ opacity: 0, y: 48, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            className="relative w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[88vh] overflow-y-auto
                       bg-slate-400 dark:bg-slate-900 border border-slate-200 dark:border-slate-800
                       rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-7 text-slate-900 dark:text-slate-100"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full
                         text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 
                         hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="mb-5 pr-10">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                Create on StudySharp
              </h2>
              <p className="text-xs sm:text-sm text-black dark:text-slate-400 mt-1">
                Share what you're learning, ask for help, or drop a resource.
              </p>
            </div>

            {/* Tabs - Explicit Background & Contrast Fix */}
            <div
              role="tablist"
              className="mb-5 flex gap-1 p-1.5 rounded-2xl bg-slate-300 dark:bg-slate-800 overflow-x-auto border border-slate-300 dark:border-slate-700"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={createModalTab === tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold
                            transition-all cursor-pointer whitespace-nowrap flex-1 justify-center
                            ${
                              createModalTab === tab.id
                                ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm border border-slate-300 dark:border-slate-700"
                                : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300/60 dark:hover:bg-slate-700/60"
                            }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Post / Doubt / Study form */}
            {(createModalTab === "post" ||
              createModalTab === "study" ||
              createModalTab === "doubt") && (
              <div className="space-y-4">
                {createModalTab === "doubt" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Question Title (questionTitle)
                    </label>
                    <input
                      type="text"
                      value={questionTitle}
                      onChange={(e) => setQuestionTitle(e.target.value)}
                      placeholder="e.g., Why does my useEffect run twice in React 18?"
                      className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100
                                 placeholder-slate-400 text-sm rounded-xl border border-slate-300
                                 dark:border-slate-700 p-3 focus:outline-none focus:ring-2
                                 focus:ring-brand-500/40"
                    />
                  </div>
                )}

                <div>
                  {createModalTab === "doubt" && (
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Detailed Explanation (questionExplanation)
                    </label>
                  )}
                  <textarea
                    rows={4}
                    value={description}
                    maxLength={CHAR_LIMIT}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      if (createModalTab === "doubt")
                        setQuestionExplanation(e.target.value);
                    }}
                    placeholder={placeholderText}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100
                               placeholder-slate-400 text-sm rounded-2xl border border-slate-300
                               dark:border-slate-700 p-3.5 focus:outline-none focus:ring-2
                               focus:ring-brand-500/40 resize-none"
                  />
                </div>

                {/* Image preview */}
                {imagePreview && (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-700">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-h-56 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-950/60 text-white cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Code snippet box */}
                {showCodeSnippet && (
                  <div className="p-3.5 rounded-2xl bg-slate-950 text-slate-100 space-y-2 border border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold text-brand-400">
                        Code snippet (codeDetails)
                      </span>
                      <div className="flex items-center gap-2">
                        <select
                          value={codeType}
                          onChange={(e) => setCodeType(e.target.value)}
                          className="bg-slate-900 text-slate-200 text-xs rounded-lg px-2 py-1 border border-slate-700"
                        >
                          <option value="JavaScript">JavaScript</option>
                          <option value="Python">Python</option>
                          <option value="Java">Java</option>
                          <option value="sql">sql</option>
                        </select>
                        <button
                          type="button"
                          onClick={handleCopyCode}
                          className="p-1 text-slate-400 hover:text-white cursor-pointer"
                        >
                          {copied ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowCodeSnippet(false)}
                          className="p-1 text-slate-400 hover:text-white cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <textarea
                      rows={4}
                      value={codeDetails}
                      onChange={(e) => setCodeDetails(e.target.value)}
                      placeholder="// Paste clean formatted code here..."
                      className="w-full bg-slate-900 font-mono text-xs text-emerald-400 p-2.5 rounded-xl border border-slate-800 resize-none focus:outline-none"
                    />
                  </div>
                )}

                {/* Subject picker */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject (subject) *
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100
                               text-xs sm:text-sm rounded-xl border border-slate-300
                               dark:border-slate-700 p-2.5 cursor-pointer"
                  >
                    {subjects.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Attachment bar & submit */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImagePick}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                    >
                      <ImageIcon className="w-4 h-4 text-emerald-500" />
                      <span>Image (img)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowCodeSnippet((v) => !v)}
                      className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-medium cursor-pointer flex items-center gap-1.5"
                    >
                      <Code className="w-4 h-4" />
                      <span>Code</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handlePreparePost}
                    className="px-5 py-2.5 bg-blue-500 text-white rounded-xl text-xs sm:text-sm
                               font-semibold hover:bg-brand-600 cursor-pointer shadow-sm"
                  >
                    {submitLabel}
                  </button>
                </div>
              </div>
            )}

            {/* Resource tab */}
            {createModalTab === "resource" && (
              <div className="space-y-4 py-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Resource Title / Caption (caption)
                  </label>
                  <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="e.g., Ultimate Roadmap to React 2026"
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100
                               text-sm rounded-xl border border-slate-300 dark:border-slate-700 p-3 mb-3"
                  />
                </div>

                {/* Subject picker for resource */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject (subject) *
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 cursor-pointer"
                  >
                    {subjects.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* File upload dropzone */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Attach file (pdf / img)
                    </label>
                    <button
                      type="button"
                      onClick={() => resourceInputRef.current?.click()}
                      className="flex items-center gap-1.5 text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Browse File</span>
                    </button>
                  </div>

                  {!resourceFile ? (
                    <div
                      onClick={() => resourceInputRef.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleResourceDrop}
                      role="button"
                      tabIndex={0}
                      className="flex flex-col items-center justify-center gap-2 text-center
                                 rounded-2xl border-2 border-dashed p-6 cursor-pointer transition-colors
                                 border-slate-300 dark:border-slate-700 hover:border-brand-400 bg-slate-50 dark:bg-slate-800/80"
                    >
                      <UploadCloud className="w-7 h-7 text-brand-500" />
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-200">
                        Drop a PDF or image here, or click to browse
                      </p>
                      <input
                        ref={resourceInputRef}
                        type="file"
                        accept={RESOURCE_ACCEPT}
                        onChange={handleResourceInputChange}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-300 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-800/80">
                      <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center flex-shrink-0">
                        <FileType2 className="w-6 h-6 text-rose-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-200 truncate">
                          {resourceFile.name}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {formatBytes(resourceFile.size)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setResourceFile(null)}
                        className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={handlePreparePost}
                    className="px-5 py-2.5 bg-blue-500 text-white rounded-xl text-xs sm:text-sm
                               font-semibold hover:bg-brand-600 cursor-pointer shadow-sm"
                  >
                    Share Resource
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
