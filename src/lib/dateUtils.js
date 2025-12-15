export function getDaysUntilDue(dueDate) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dueDateObj = new Date(dueDate)
  dueDateObj.setHours(0, 0, 0, 0)

  const diffTime = dueDateObj.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}

export function isUrgent(dueDate, notificationDays) {
  const daysUntil = getDaysUntilDue(dueDate)
  return daysUntil <= notificationDays && daysUntil >= 0
}

export function getStatusColor(daysUntil, isPaid) {
  if (isPaid) return "text-green-600 dark:text-green-400"
  if (daysUntil < 0) return "text-red-600 dark:text-red-400"
  if (daysUntil === 0) return "text-red-600 dark:text-red-400"
  if (daysUntil === 1) return "text-orange-600 dark:text-orange-400"
  if (daysUntil <= 3) return "text-orange-600 dark:text-orange-400"
  return "text-slate-500"
}
