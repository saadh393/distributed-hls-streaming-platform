import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Clock, Pencil } from "lucide-react";

export default function VideoCard({ video, onEditClick }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video bg-gray-100">
        {video.thumbnail && (
          <img
            src={`/api/video/thumbnail/${video.id}`}
            alt={video.title || 'Untitled video'}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
          {video.duration}
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className={`font-medium line-clamp-2 ${video.title ? 'text-gray-100' : 'text-gray-400 italic'
              }`}>
              {video.title || 'Untitled'}
            </h3>
            <p className={`text-sm mt-1 line-clamp-2 ${video.description ? 'text-gray-300' : 'text-gray-400 italic text-xs'
              }`}>
              {video.description || 'No description'}
            </p>
            <div className="mt-2 flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${video.status === 'success'
                ? 'bg-green-100 text-green-800'
                : video.status === 'processing'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-yellow-100 text-yellow-800'
                }`}>
                {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
              </span>
              <span className="flex items-center text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                {video.duration || '00:00'}
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="ml-4"
            onClick={() => onEditClick(video)}
          >
            <Pencil className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </div>
      </div>
    </Card>
  );
}
