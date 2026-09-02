import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiImage, FiFileText } from "react-icons/fi";
import toast from "react-hot-toast";
import { postUrl } from "../api/Axios";
import { useDispatch } from "react-redux";
import { addPost, loginSuccess } from "../store/CreateSlice";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const ALLOWED_PDF_TYPES = ["application/pdf"];

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

const CreatePost = ({ isOpen, setIsopen }) => {
  const dispatch = useDispatch();

  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState(null);

  // Loading state
  const [loading, setLoading] = useState(false);

  // ==============================
  // Handle File Selection
  // ==============================
  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (!selected) {
      toast.error("Please select a file");
      return;
    }

    // File size validation
    if (selected.size > MAX_SIZE) {
      toast.error("File should not be bigger than 10 MB");
      return;
    }

    // Image
    if (ALLOWED_IMAGE_TYPES.includes(selected.type)) {
      setFileType("image");
      setPreview(URL.createObjectURL(selected));
      setFile(selected);
    }

    // PDF
    else if (ALLOWED_PDF_TYPES.includes(selected.type)) {
      setFileType("pdf");
      setPreview(null);
      setFile(selected);
    }

    // Invalid file
    else {
      toast.error("Only JPG, PNG, WEBP or PDF files are allowed");
    }
  };

  // ==============================
  // Remove Selected File
  // ==============================
  const removeFile = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setFile(null);
    setPreview(null);
    setFileType(null);
  };

  // ==============================
  // Submit Post
  // ==============================
  const handleSubmit = async () => {
    // Prevent request if file doesn't exist
    if (!file) {
      toast.error("Please select at least one file");
      return;
    }

    // Prevent duplicate request
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("img", file);
      formData.append("caption", caption);

      const res = await postUrl.post("/addpost", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Success message
      toast.success(res.data.message || "Post created successfully");

      // Clear form
      setFile(null);
      setPreview(null);
      setFileType(null);
      setCaption("");

      // Update Redux
      dispatch(addPost(res.data.post));
      dispatch(loginSuccess(res.data.user));

      // Close modal
      setIsopen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      // Whether success or error
      setLoading(false);
    }
  };

  // ==============================
  // Close Modal
  // ==============================
  const handleClose = () => {
    // Don't allow closing while request is running
    if (loading) {
      return;
    }

    setIsopen(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* ==============================
          Overlay
      ============================== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={handleClose}
      >
        {/* ==============================
            Modal
        ============================== */}
        <motion.div
          initial={{
            scale: 0.9,
            opacity: 0,
            y: 20,
          }}
          animate={{
            scale: 1,
            opacity: 1,
            y: 0,
          }}
          exit={{
            scale: 0.9,
            opacity: 0,
            y: 20,
          }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="relative z-60 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
        >
          {/* ==============================
              Header
          ============================== */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/90 px-5 py-4 backdrop-blur dark:border-gray-700 dark:bg-gray-900/90">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Create Post
            </h2>

            <button
              onClick={handleClose}
              disabled={loading}
              className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* ==============================
              Body
          ============================== */}
          <div className="space-y-4 px-5 py-5">
            {/* Caption */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
                Caption
              </label>

              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                disabled={loading}
                placeholder="Kya soch rahe ho?"
                rows={3}
                className="w-full resize-none rounded-xl border border-gray-300 bg-gray-50 p-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* ==============================
                File Upload
            ============================== */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
                Media
              </label>

              {!file ? (
                <label
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-8 text-gray-500 transition dark:border-gray-700 dark:bg-gray-800 ${
                    loading
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="flex gap-3 text-indigo-500">
                    <FiImage size={22} />
                    <FiFileText size={22} />
                  </div>

                  <span className="text-sm">Image ya PDF select karo</span>

                  <span className="text-xs text-gray-400">Max 10MB</span>

                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    disabled={loading}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative rounded-xl border border-gray-200 p-3 dark:border-gray-700">
                  {/* Remove file */}
                  <button
                    onClick={removeFile}
                    disabled={loading}
                    className="absolute -right-2 -top-2 z-10 rounded-full bg-red-500 p-1 text-white shadow hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <FiX size={14} />
                  </button>

                  {/* Image Preview */}
                  {fileType === "image" ? (
                    <img
                      src={preview}
                      alt="preview"
                      className="max-h-64 w-full rounded-lg object-cover"
                    />
                  ) : (
                    /* PDF Preview */
                    <div className="flex items-center gap-3 rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
                      <FiFileText size={28} className="text-red-500" />

                      <span className="truncate text-sm text-gray-700 dark:text-gray-200">
                        {file.name}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ==============================
              Footer
          ============================== */}
          <div className="sticky bottom-0 flex justify-end gap-3 border-t border-gray-200 bg-white/90 px-5 py-4 backdrop-blur dark:border-gray-700 dark:bg-gray-900/90">
            {/* Cancel */}
            <button
              onClick={handleClose}
              disabled={loading}
              className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>

            {/* ==============================
                Post Button
            ============================== */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex min-w-25 cursor-pointer items-center justify-center rounded-xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  {/* Spinner */}
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Posting...
                </span>
              ) : (
                "Post"
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreatePost;
