import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addPost, loginSuccess } from "../store/auth.slice";
import { postUrl } from "../api/Axios";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_PDF_TYPES = ["application/pdf"];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

const CODE_TYPES = ["Java", "Python", "JavaScript", "sql"];

export const validateCodeType = (value) => {
  const trimmed = value?.trim() ?? "";
  if (trimmed === "") return { valid: true }; // empty is allowed
  const isValid = CODE_TYPES.some(
    (type) => type.toLowerCase() === trimmed.toLowerCase(),
  );
  return {
    valid: isValid,
    error: isValid ? null : `codeType must be one of: ${CODE_TYPES.join(", ")}`,
  };
};

export const useCreatePostLogic = (isOpen, setIsopen) => {
  const dispatch = useDispatch();

  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle File Selection
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

  // Remove Selected File
  const removeFile = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setFile(null);
    setPreview(null);
    setFileType(null);
  };

  // Submit Post
  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please select at least one file");
      return;
    }

    if (loading) return;

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

      toast.success(res.data.message || "Post created successfully");

      // Clear form
      setFile(null);
      setPreview(null);
      setFileType(null);
      setCaption("");

      // Update Redux
      dispatch(addPost(res.data.post));
      dispatch(loginSuccess(res.data.user));

      setIsopen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Close Modal
  const handleClose = () => {
    if (loading) return;
    setIsopen(false);
  };

  return {
    caption,
    setCaption,
    file,
    preview,
    fileType,
    loading,
    handleFileChange,
    removeFile,
    handleSubmit,
    handleClose,
    validateCodeType,
  };
};
