const REQUEST_STATUS_LABELS: Record<string, string> = {
  new: "جدید",
  contacted: "تماس گرفته شده",
  in_discussion: "در حال مذاکره",
  completed: "تکمیل شده",
  cancelled: "لغو شده",
};

export function requestStatusLabel(status: string): string {
  return REQUEST_STATUS_LABELS[status] ?? status;
}
