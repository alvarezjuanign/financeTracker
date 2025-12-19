export const urgencyStyles = {
  high: {
    card: "border-red-500/40 bg-red-500/10",
    badge: "bg-red-500/15 text-red-600 dark:text-red-400",
  },
  medium: {
    card: "border-yellow-500/40 bg-yellow-500/10",
    badge: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400",
  },
  low: {
    card: "border-emerald-500/40 bg-emerald-500/10",
    badge: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  },
};

export const getUrgency = (due_date) => {
  const today = new Date();
  const due = new Date(due_date);

  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 7) return "low";
  if (diffDays > 3) return "medium";
  return "high";
};
