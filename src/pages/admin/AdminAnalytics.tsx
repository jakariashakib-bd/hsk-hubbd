import Breadcrumb from '@/components/Breadcrumb';
import { BarChart3, Users, BookOpen, TrendingUp, Activity } from 'lucide-react';

const stats = [
  { label: 'Total Users', value: '0', icon: Users, color: 'bg-card-mint' },
  { label: 'Active Today', value: '0', icon: Activity, color: 'bg-card-salmon' },
  { label: 'Lessons Completed', value: '0', icon: BookOpen, color: 'bg-card-gold' },
  { label: 'Growth Rate', value: '0%', icon: TrendingUp, color: 'bg-card-teal' },
];

const AdminAnalytics = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <Breadcrumb items={[{ label: 'Admin', to: '/admin' }, { label: 'Analytics' }]} />
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="text-primary" size={28} />
        <h1 className="text-3xl font-bold">Analytics</h1>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className={`${s.color} brutalist-border rounded-xl p-5`}>
            <s.icon size={24} className="text-foreground/70 mb-2" />
            <p className="text-3xl font-bold">{s.value}</p>
            <p className="text-xs font-mono text-foreground/60 uppercase mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="brutalist-card rounded-xl p-8 bg-card text-center">
        <p className="text-muted-foreground font-mono">📊 Detailed analytics will appear here as users interact with the platform</p>
      </div>
    </div>
  );
};

export default AdminAnalytics;
