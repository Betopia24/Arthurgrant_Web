// Skeleton Components
export const VideoPlayerSkeleton = () => (
  <div className="w-full aspect-video bg-gray-700 rounded-lg animate-pulse flex items-center justify-center">
    <div className="text-gray-500">Loading video...</div>
  </div>
);

export const VideoInfoSkeleton = () => (
  <div className="mt-4 space-y-2">
    <div className="h-6 bg-gray-700 rounded animate-pulse w-3/4"></div>
    <div className="h-4 bg-gray-700 rounded animate-pulse w-full"></div>
    <div className="h-4 bg-gray-700 rounded animate-pulse w-2/3"></div>
    <div className="flex flex-wrap gap-4 mt-2">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="h-3 bg-gray-700 rounded animate-pulse w-16"></div>
      ))}
    </div>
  </div>
);

export const TaskListSkeleton = () => (
  <div className="flex flex-col gap-2 mt-2">
    {[1, 2, 3].map((item) => (
      <div key={item} className="flex items-center gap-2">
        <div className="w-5 h-5 bg-gray-700 rounded-full animate-pulse"></div>
        <div className="h-4 bg-gray-700 rounded animate-pulse flex-1"></div>
      </div>
    ))}
  </div>
);

export const VideoListSkeleton = () => (
  <div className="mt-4 p-4 bg-[#3A3D57] rounded-lg max-h-80 overflow-y-auto">
    <div className="h-6 bg-gray-700 rounded animate-pulse w-1/3 mb-3"></div>
    <div className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="flex items-start gap-3 p-3 rounded-lg bg-[#4C4F69]">
          <div className="w-16 h-12 bg-gray-700 rounded flex-shrink-0 animate-pulse"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4"></div>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((tag) => (
                <div
                  key={tag}
                  className="h-3 bg-gray-700 rounded animate-pulse w-12"></div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
