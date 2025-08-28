import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Play } from "lucide-react";
import { useApp } from "../context/app-context";


export function VideosGrid() {
  const { videos } = useApp();

  if (!videos.videos && videos.state == "loading") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 m-8">
        {Array.from({ length: 50 }).map((x, i) => {
          return <div key={i} className="p-10 bg-zinc-700 rounded-md"></div>;
        })}
      </div>
    );
  }

  if (!videos.videos && videos.state != "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">No videos are published yet</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-foreground">Your Videos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.videos.map((video) => (
          <a key={video.id} href={`/video/${video.id}`}>
            <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    // eslint-disable-next-line no-constant-binary-expression
                    src={`/api/video/thumbnail/${video.id}` || "/placeholder.svg"}
                    alt={video.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-t-lg flex items-center justify-center">
                    <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-card-foreground mb-2 line-clamp-2 leading-tight">{video.title}</h3>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">

                      <AvatarFallback className="text-xs">
                        {video.uploader.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{video.uploader.name}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
