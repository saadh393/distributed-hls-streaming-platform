import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import FileHandler from "./file-handler";

export function AddVideo() {
  const [selectedFile, setSelectedFile] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle video upload logic here
    console.log("[v0] Upload submitted:", { file: selectedFile, title, description });
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
            <FileHandler selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
          </CardContent>
        </Card>

        {/* Video Details */}
        <Card>
          <CardHeader>
            <CardTitle>Video Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter video title"
                required
              />
            </div>

            <div>
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

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={!selectedFile || !title.trim()} className="px-8">
            Upload Video
          </Button>
        </div>
      </form>
    </div>
  );
}
