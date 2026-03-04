import { Link } from 'react-router-dom';
import { Users, BookOpen, ClipboardList, BarChart3, Settings, Shield } from 'lucide-react';
import Breadcrumb from '@/components/Breadcrumb';

const adminCards = [
  { to: '/admin/users', icon: Users, label: 'Users', desc: 'Manage all users & roles', color: 'bg-card-mint' },
  { to: '/admin/lessons', icon: BookOpen, label: 'Lessons', desc: 'Add/edit HSK lessons', color: 'bg-card-salmon' },
  { to: '/admin/vocabulary', icon: ClipboardList, label: 'Vocabulary', desc: 'Manage word database', color: 'bg-card-gold' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics', desc: 'Site stats & usage', color: 'bg-card-teal' },
  { to: '/admin/settings', icon: Settings, label: 'Settings', desc: 'App configuration', color: 'bg-card-purple' },
];

const AdminDashboard = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <Breadcrumb items={[{ label: 'Admin', to: '/admin' }, { label: 'Dashboard' }]} />

      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Shield className="text-primary" size={28} />
          <h1 className="text-3xl font-bold">Admin Panel</h1>
        </div>
        <p className="text-muted-foreground mt-1 font-mono text-sm">Manage your HSK Hub platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {adminCards.map((card) => (
          <Link key={card.to} to={card.to} className={`${card.color} brutalist-border rounded-xl p-6 hover:translate-x-[2px] hover:translate-y-[2px] transition-transform`}>
            <card.icon size={28} className="text-foreground/80 mb-3" />
            <h3 className="font-bold text-lg">{card.label}</h3>
            <p className="text-sm text-foreground/60 font-mono mt-1">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
