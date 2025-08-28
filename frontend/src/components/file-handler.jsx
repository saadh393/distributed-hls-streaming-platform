import { Button } from "@/components/ui/button";
import { Play, Upload, Video, VideoIcon, X } from "lucide-react";
import { useState } from "react";
import { Progress } from "./ui/progress";
import { complete_upload, fetch_signed_url, get_upload_permission, upload_chunk } from "../lib/upload-api";
import Error from "./error-message";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const CHUNK_SIZE = 1024 * 1024; // 1MB

export default function FileHandler({ videoId, setVideoId, setTitle }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUpload] = useState(0)
  const [error, setError] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("video/")) {
        setSelectedFile(file);
        handleFileUpload(file)

      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("video/")) {
        setSelectedFile(file);
        handleFileUpload(file)
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };


  async function handleFileUpload(file) {
    try {
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      const fileName = file.name
      setTitle(fileName)

      // Steps
      // Step 1 : Request for Signed link and token 
      const { token, uploadUrl, origin } = await fetch_signed_url();

      // Step 2 : Request for upload permission
      // Send - fileName, totalChunks
      const { videoId } = await get_upload_permission({
        baseurl: uploadUrl, token, uploadUrl, fileName, totalChunks
      })

      // Setp 3 : Upload Chunks
      // Route = origin + "/files/" +" /upload/:videoId/:chunkIndex"
      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(file.size, start + CHUNK_SIZE);

        const chunk = file.slice(start, end);
        const formData = new FormData();

        formData.append('chunk', chunk)
        const baseurl = `${origin}/files/upload/${videoId}/${i}`
        await upload_chunk({ baseurl, formData, token });

        // Update the progressbar
        setUpload((prev) => prev + (1 / totalChunks) * 100);
      }

      // Step 4 : Complete the Upload
      const baseurl = `${origin}/files/upload/${videoId}/complete`
      await complete_upload({ baseurl, token })
      setVideoId(videoId)
      setUpload(100);

    } catch (error) {
      setError(error.message)
    }

  }

  if (videoId && uploadProgress == 100) {
    return <Card>
      <CardHeader>
        <CardTitle>Upload Complete</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-zinc-800 w-full aspect-video h-auto grid place-items-center rounded-md">
          <Play className="h-12 w-12 text-muted-foreground" />
        </div>
        <div className="flex-1 mt-4">
          <p className="font-medium">{selectedFile.name}</p>
          <p className="text-sm text-muted-foreground">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
        </div>
      </CardContent>
    </Card>
  }


  return <>
    <Error>{error}</Error>
    {!selectedFile ? (
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-lg font-medium mb-2">Drop your video here</p>
        <p className="text-muted-foreground mb-4">or</p>
        <Button type="button" variant="outline" asChild>
          <label className="cursor-pointer">
            Choose File
            <input type="file" accept="video/*" onChange={handleFileSelect} className="hidden" />
          </label>
        </Button>
        <p className="text-xs text-muted-foreground mt-2">Supports MP4, MOV, AVI up to 2GB</p>
      </div>
    ) : (
      <div>
        <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
          <Video className="h-8 w-8 text-primary" />
          <div className="flex-1">
            <p className="font-medium">{selectedFile.name}</p>
            <p className="text-sm text-muted-foreground">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={removeFile}>
            <X className="h-4 w-4" />
          </Button>


        </div>
        <div className="flex items-center gap-4 p-4 ">
          <Progress value={uploadProgress} />
          <Button type="button" variant="outline" size="sm" onClick={removeFile}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )}
  </>
}
