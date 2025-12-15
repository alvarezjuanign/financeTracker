import { ServicesManager } from "./components/ServiceManager"
import { NotificationHandler } from "./components/NotificationHandler"

export function App() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-4">
      <NotificationHandler />
      <ServicesManager />
    </div>
  )
}
