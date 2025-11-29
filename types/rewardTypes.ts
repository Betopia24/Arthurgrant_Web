export interface DailyCheckRewardResponseType {
  success: boolean;
  message: string;
  data: {
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
  };
}
