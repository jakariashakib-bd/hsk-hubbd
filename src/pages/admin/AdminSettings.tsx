import { useState } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Settings, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminSettings = () => {
  const [siteName, setSiteName] = useState('HSK Hub');
  const [maintenance, setMaintenance] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const { toast } = useToast();

  const save = () => { toast({ title: '✅ Settings saved!' }); };

  return (
    <div className="max-w-3xl mx-auto">
      <Breadcrumb items={[{ label: 'Admin', to: '/admin' }, { label: 'Settings' }]} />
      <div className="flex items-center gap-3 mb-6">
        <Settings className="text-primary" size={28} />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>
      <div className="brutalist-card rounded-xl p-6 bg-card space-y-6">
        <div>
          <label className="text-xs font-mono uppercase text-muted-foreground">Site Name</label>
          <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} className="mt-1" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Maintenance Mode</p>
            <p className="text-xs text-muted-foreground font-mono">Disable site for all users</p>
          </div>
          <Switch checked={maintenance} onCheckedChange={setMaintenance} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Open Registration</p>
            <p className="text-xs text-muted-foreground font-mono">Allow new signups</p>
          </div>
          <Switch checked={registrationOpen} onCheckedChange={setRegistrationOpen} />
        </div>
        <Button onClick={save} className="brutalist-shadow"><Save size={16} /> Save Settings</Button>
      </div>
    </div>
  );
};

export default AdminSettings;
