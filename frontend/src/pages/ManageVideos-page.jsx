import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import VideoForm from "../components/manage/VideoForm";
import VideoList from "../components/manage/VideoList";
import { getJson, patchJson, postJson, deleteJson } from "../lib/api";

export default function ManageVideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingVideo, setDeletingVideo] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const data = await getJson("/video", { credentials: "include" });
      setVideos(data);
    } catch (err) {
      console.error("Failed to fetch videos:", err);
      setError(err.message || "Failed to load videos");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (video) => {
    setEditingVideo(video);
  };

  const handleCancelEdit = () => {
    setEditingVideo(null);
  };

  const handleSave = async (formData) => {
    if (!editingVideo) return;

    try {
      setSaving(true);
      await patchJson(
        `/video/${editingVideo.id}`,
        {
          title: formData.title,
          description: formData.description,
          status: formData.isPublished ? "published" : "success",
        },
        { credentials: "include" }
      );

      await fetchVideos();
      setEditingVideo(null);
    } catch (err) {
      console.error("Failed to update video:", err);
      setError(err.message || "Failed to update video");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (video) => {
    setDeletingVideo(video);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingVideo) return;

    try {
      setSaving(true);
      await deleteJson(`/video/${deletingVideo.id}`, { credentials: "include" });
      await fetchVideos();
      setShowDeleteConfirm(false);
      setDeletingVideo(null);
    } catch (err) {
      console.error("Failed to delete video:", err);
      setError(err.message || "Failed to delete video");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setDeletingVideo(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Manage Your Videos</h1>
      </div>

      {editingVideo ? (
        <div className=" rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium mb-6">Edit Video</h2>
          <VideoForm video={editingVideo} onSave={handleSave} onCancel={handleCancelEdit} isSaving={saving} />
        </div>
      ) : (
        <VideoList videos={videos} onEditClick={handleEditClick} onDeleteClick={handleDeleteClick} />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Delete Video</h3>
            <p className="text-zinc-400 mb-6">
              Are you sure you want to delete "{deletingVideo?.title || 'Untitled'}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                disabled={saving}
                className="px-4 py-2 text-zinc-300 border border-zinc-300 rounded-md hover:bg-zinc-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={saving}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
