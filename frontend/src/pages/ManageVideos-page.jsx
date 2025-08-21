import { useState, useEffect } from "react";
import { getJson, postJson } from "../lib/api";
import { Loader2 } from "lucide-react";
import VideoList from "../components/manage/VideoList";
import VideoForm from "../components/manage/VideoForm";

export default function ManageVideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const data = await getJson("/video", { credentials: 'include' });
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
      await postJson(`/video/${editingVideo.id}`, {
        title: formData.title,
        description: formData.description,
        isPublished: formData.isPublished
      }, { credentials: 'include' });

      await fetchVideos();
      setEditingVideo(null);
    } catch (err) {
      console.error("Failed to update video:", err);
      setError(err.message || "Failed to update video");
    } finally {
      setSaving(false);
    }
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
          <VideoForm
            video={editingVideo}
            onSave={handleSave}
            onCancel={handleCancelEdit}
            isSaving={saving}
          />
        </div>
      ) : (
        <VideoList
          videos={videos}
          onEditClick={handleEditClick}
        />
      )}
    </div>
  );
}
