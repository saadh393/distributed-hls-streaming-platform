import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import FileHandler from "./file-handler";
import { add_video } from "../lib/upload-api";
import Error from "./error-message";
import Success from "./success-message";
import { useNavigate } from "react-router";

export function AddVideo() {
  const [videoId, setVideoId] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null)
  const [response, setResponse] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();


    const formData = {
      title, description, video_id: videoId
    }

    try {
      const baseurl = "/api/video/";
      const response = await add_video({ baseurl, formData });
      setResponse(response?.message || "Success")
      setTitle("")
      setDescription("")
      setVideoId(false);

      setTimeout(() => {
        navigate("/")
      }, 2000)

    } catch (err) {
      setError(err.message)
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-foreground">Upload New Video</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Upload Area */}
        <Card>
          <CardHeader>
            <CardTitle>Video File</CardTitle>
          </CardHeader>
          <CardContent>
            <FileHandler videoId={videoId} setVideoId={setVideoId} />
          </CardContent>
        </Card>

        {/* Video Details */}
        <Card>
          <CardHeader>
            <CardTitle>Video Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter video title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter video description"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Error cancel={() => setError(null)}>{error}</Error>
        <Success cancel={() => setResponse(null)}>{response}</Success>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={!videoId || !title.trim()} className="px-8">
            Upload Video
          </Button>
        </div>
      </form>
    </div>
  );
}
