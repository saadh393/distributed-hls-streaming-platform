import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Maximize, Pause, Play, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getVideoById } from "../lib/api";
import HlsPlayer from "../components/hls-player";


export default function VideoPlayer() {
  const navigate = useNavigate();
  const { videoId } = useParams();
  const [videoData, setVideoData] = useState({
    isLoading: true,
    isError: false,
    error: null,
    data: null
  })

  useEffect(() => {
    getVideoById(videoId).then(data => {
      setVideoData({
        isLoading: false,
        isError: false,
        error: null,
        data
      })
    }).catch(error => {
      setVideoData({
        isLoading: false,
        isError: true,
        error,
        data: null
      })
    })
  }, [videoId])


  if (videoData.isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  if (videoData.error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Something went wrong</h1>
          <p className="text-muted-foreground">{videoData.error.message}</p>
          <Button onClick={() => window.location.reload()}>Reload</Button>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  if(videoData.data == null){
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Video not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border p-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-lg font-semibold text-foreground">VideoHub</h1>
        </div>
      </header>

      {/* Video Player */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6 relative group">
          <HlsPlayer src={videoData.data.videoUrl}/>
        </div>

        {/* Video Info */}
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-foreground">{videoData.data.title}</h1>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {videoData.data.uploader.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-foreground">{videoData.data.uploader.name}</h3>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-muted-foreground leading-relaxed">{videoData.data.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
