export interface DailyCheckRewardResponseType {
  canUnlock: boolean;
  alreadyUnlocked: boolean;
  unlockedVideo: string | null;
  progress: {
    completedCount: number;
    totalCount: number;
    remainingCount: number;
    percentage: number;
    taskStatus: {
      reading: boolean;
      adult: boolean;
      writing: boolean;
      speaking: boolean;
      presentation: boolean;
    };
    tasks: {
      name: string;
      completed: boolean;
      icon: string;
    }[];
  };
}

export interface RewardVideoItemsType {
  id: string;
  title: string;
  description: string;
  category: string;
  videoUrl: string;
  fileSize: number;
  age: string;
  views: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RewardVideoItemsResponseType {
  success: boolean;
  message: string;
  data: RewardVideoItemsType[];
}
