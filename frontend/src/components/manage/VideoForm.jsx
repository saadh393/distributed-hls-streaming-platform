import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Loader2, Save, X } from "lucide-react";

export default function VideoForm({
  video,
  onSave,
  onCancel,
  isSaving
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isPublished: false
  });

  useEffect(() => {
    if (video) {
      setFormData({
        title: video.title || "",
        description: video.description || "",
        isPublished: video.isPublished || false
      });
    }
  }, [video]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!video) return null;

  return (
    <div className="space-y-4 ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter video title"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Enter video description"
              className="mt-1"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="isPublished"
              checked={formData.isPublished}
              onCheckedChange={(checked) =>
                setFormData(prev => ({ ...prev, isPublished: checked }))
              }
            />
            <Label htmlFor="isPublished">
              {formData.isPublished ? "Published" : "Draft"}
            </Label>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Preview</Label>
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            {video.thumbnail && (
              <img
                src={`/api/video/thumbnail/${video.id}`}
                alt={formData.title || 'Video thumbnail'}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="text-sm text-gray-500">
            <p>Duration: {video.duration || '00:00'}</p>
            <p>Status: {video.status}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
