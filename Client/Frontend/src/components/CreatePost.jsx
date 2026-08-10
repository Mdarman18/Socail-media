import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiImage, FiFileText, FiTag } from "react-icons/fi";
import toast from "react-hot-toast";
import { postUrl } from "../api/Axios";
import { useDispatch } from "react-redux";
import { addPost, loginSuccess } from "../store/CreateSlice";
import { data } from "react-router-dom";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_PDF_TYPES = ["application/pdf"];
const MAX_SIZE = 10 * 1024 * 1024;

const CreatePost = ({ isOpen, setIsopen }) => {
  const dispatch = useDispatch();
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState(null); // "image" | "pdf"

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) {
      toast.error("please select a file");
      return;
    }
    if (selected.size > MAX_SIZE) {
      toast.error("Flie are not bigger than 10 M.B");
      return;
    }

    if (ALLOWED_IMAGE_TYPES.includes(selected.type)) {
      setFileType("image");
      setPreview(URL.createObjectURL(selected));
      setFile(selected);
    } else if (ALLOWED_PDF_TYPES.includes(selected.type)) {
      setFileType("pdf");
      setPreview(null);
      setFile(selected);
    } else {
      toast.error("Sirf image (jpg/png/webp) ya PDF allowed hai");
    }
  };

  const removeFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setFileType(null);
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("please select atleast one file");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("img", file);
      formData.append("caption", caption);
      const res = await postUrl.post("/addpost", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(res.data.messsage);
      setFile(null);
      setPreview(null);
      setFileType(null);
      dispatch(addPost(res.data.post));
      dispatch(loginSuccess(res.data.user));
      setIsopen(!isOpen);
    } catch (error) {
      console.log(error);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Overlay — z-50 taaki har cheez ke upar rahe */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={() => setIsopen(!isOpen)}
      >
        {/* Modal box — z-index modal se upar hai naturally due to stacking, click stop propagation */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="relative z-60 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/90 backdrop-blur px-5 py-4 dark:border-gray-700 dark:bg-gray-900/90">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Create Post
            </h2>
            <button
              onClick={() => setIsopen(!isOpen)}
              className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="space-y-4 px-5 py-5">
            {/* Caption */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
                Caption
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Kya soch rahe ho?"
                rows={3}
                className="w-full resize-none rounded-xl border border-gray-300 bg-gray-50 p-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* File Upload Section */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
                Media
              </label>

              {!file ? (
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-8 text-gray-500 transition hover:border-indigo-400 hover:bg-indigo-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                  <div className="flex gap-3 text-indigo-500">
                    <FiImage size={22} />
                    <FiFileText size={22} />
                  </div>
                  <span className="text-sm">Image ya PDF select karo</span>
                  <span className="text-xs text-gray-400">Max 5MB</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative rounded-xl border border-gray-200 p-3 dark:border-gray-700">
                  <button
                    onClick={removeFile}
                    className="absolute -right-2 -top-2 z-10 rounded-full bg-red-500 p-1 text-white shadow hover:bg-red-600"
                  >
                    <FiX size={14} />
                  </button>

                  {fileType === "image" ? (
                    <img
                      src={preview}
                      alt="preview"
                      className="max-h-64 w-full rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex items-center gap-3 rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
                      <FiFileText size={28} className="text-red-500" />
                      <span className="truncate text-sm text-gray-700 dark:text-gray-200">
                        {file.name}
                      </span>
                    </div>
                  )}
                </div>
              )}
              {/* 
              {error && (
                <p className="mt-2 text-xs font-medium text-red-500">{error}</p>
              )} */}
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 flex justify-end gap-3 border-t border-gray-200 bg-white/90 px-5 py-4 backdrop-blur dark:border-gray-700 dark:bg-gray-900/90">
            <button
              onClick={() => setIsopen(!isOpen)}
              className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              Post
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreatePost;
