"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { getGalleryImages, uploadGalleryImage, deleteGalleryImage } from "@/lib/api";
import toast from "react-hot-toast";
import { Upload, Trash2, X } from "lucide-react";

const categories = ["Activities", "Classroom", "Playground", "Events"];

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const fileRef = useRef(null);

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  const fetchImages = async () => {
    try {
      const res = await getGalleryImages();
      setImages(res.data);
    } catch {
      toast.error("Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchImages(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file || !title || !category) {
      toast.error("Please fill all fields");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("title", title);
      formData.append("category", category);
      await uploadGalleryImage(formData);
      toast.success("Image uploaded");
      setTitle("");
      setCategory("");
      if (fileRef.current) fileRef.current.value = "";
      setShowUpload(false);
      fetchImages();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this image?")) return;
    try {
      await deleteGalleryImage(id);
      toast.success("Deleted");
      fetchImages();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
          <p className="text-gray-500 mt-1">Manage gallery images</p>
        </div>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          {showUpload ? <X size={16} /> : <Upload size={16} />}
          {showUpload ? "Cancel" : "Upload Image"}
        </button>
      </div>

      {showUpload && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Image title"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
              >
                <option value="">Select</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm file:mr-3 file:py-1 file:px-3 file:border-0 file:bg-primary/10 file:text-primary file:rounded-lg file:font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 disabled:opacity-60 transition-colors"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : images.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <p className="text-gray-400">No images uploaded yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((img) => (
            <div key={img._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
              <div className="relative aspect-square">
                <Image
                  src={`${SERVER_URL}${img.imageUrl}`}
                  alt={img.title}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => handleDelete(img._id)}
                  className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="p-4">
                <p className="font-medium text-gray-900 text-sm">{img.title}</p>
                <p className="text-xs text-gray-400 mt-1">{img.category}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
