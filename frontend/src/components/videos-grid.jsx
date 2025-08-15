import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Play } from "lucide-react";
import Link from "next/link";

const mockVideos = [
  {
    id: 1,
    title: "Getting Started with React",
    publisher: "Tech Academy",
    publisherAvatar: "/placeholder.svg?height=32&width=32",
    thumbnail: "/placeholder.svg?height=180&width=320",
    duration: "12:34",
  },
  {
    id: 2,
    title: "Advanced JavaScript Concepts",
    publisher: "Code Masters",
    publisherAvatar: "/placeholder.svg?height=32&width=32",
    thumbnail: "/placeholder.svg?height=180&width=320",
    duration: "18:45",
  },
  {
    id: 3,
    title: "Building Modern UIs",
    publisher: "Design Pro",
    publisherAvatar: "/placeholder.svg?height=32&width=32",
    thumbnail: "/placeholder.svg?height=180&width=320",
    duration: "25:12",
  },
  {
    id: 4,
    title: "Database Design Patterns",
    publisher: "Data Experts",
    publisherAvatar: "/placeholder.svg?height=32&width=32",
    thumbnail: "/placeholder.svg?height=180&width=320",
    duration: "32:18",
  },
  {
    id: 5,
    title: "API Development Best Practices",
    publisher: "Backend Guru",
    publisherAvatar: "/placeholder.svg?height=32&width=32",
    thumbnail: "/placeholder.svg?height=180&width=320",
    duration: "28:56",
  },
  {
    id: 6,
    title: "Mobile App Development",
    publisher: "Mobile Dev",
    publisherAvatar: "/placeholder.svg?height=32&width=32",
    thumbnail: "/placeholder.svg?height=180&width=320",
    duration: "41:23",
  },
];

export function VideosGrid() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-foreground">Your Videos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockVideos.map((video) => (
          <Link key={video.id} href={`/video/${video.id}`}>
            <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
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
                      <AvatarImage src={video.publisherAvatar || "/placeholder.svg"} alt={video.publisher} />
                      <AvatarFallback className="text-xs">
                        {video.publisher
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{video.publisher}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
