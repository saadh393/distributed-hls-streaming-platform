import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Maximize, Pause, Play, Volume2 } from "lucide-react";
import { useNavigate } from "react-router";

export default function VideoPlayer() {
  const navigate = useNavigate();

  const video = {
    id: "1",
    title: "Getting Started with React",
    publisher: "Tech Academy",
    publisherAvatar: "/placeholder.svg?height=32&width=32",
    videoUrl: "/placeholder.svg?height=480&width=854",
    description:
      "Learn the fundamentals of React in this comprehensive tutorial. We'll cover components, props, state, and more.",
    views: "12,543",
    uploadDate: "2 days ago",
  };

  if (!video) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Video not found</h1>
          <Button onClick={() => router.back()}>Go Back</Button>
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
          <img src={video.videoUrl || "/placeholder.svg"} alt={video.title} className="w-full h-full object-cover" />

          {/* Video Controls Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-0">
              <Play className="h-8 w-8" />
            </Button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex items-center gap-4">
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                <Pause className="h-4 w-4" />
              </Button>
              <div className="flex-1 bg-white/30 h-1 rounded-full">
                <div className="bg-primary h-full w-1/3 rounded-full"></div>
              </div>
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                <Volume2 className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Video Info */}
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-foreground">{video.title}</h1>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={video.publisherAvatar || "/placeholder.svg"} alt={video.publisher} />
                <AvatarFallback>
                  {video.publisher
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-foreground">{video.publisher}</h3>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-muted-foreground leading-relaxed">{video.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
