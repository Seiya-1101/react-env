export type StudyPeriod = "daily" | "weekly" | "monthly";

export type Task = {
  id: string;
  title: string;
  category: string;
  period: StudyPeriod;
  completed: boolean;
  createdAt: string;
};
