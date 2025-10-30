export type ReviewModalForm = {
  rating: number;
  review: string;
  duration: number;
  completion: number;
  completionComment?: string;
  pros: { value: string }[];
  cons: { value: string }[];
  shouldNotify: boolean;
};
