// app/page.tsx
import { EventDashboard } from '@/components/dashboard/event-dashboard';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <EventDashboard />
    </div>
  );
}