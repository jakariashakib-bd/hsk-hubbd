import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Breadcrumb from '@/components/Breadcrumb';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Trash2, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  email: string | null;
  created_at: string;
}

interface UserRole {
  user_id: string;
  role: string;
}

interface UserPlan {
  user_id: string;
  plan: string;
}

const AdminUsers = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [plans, setPlans] = useState<UserPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    const [profilesRes, rolesRes, plansRes] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('user_roles').select('*'),
      supabase.from('user_plans').select('*'),
    ]);
    setProfiles(profilesRes.data || []);
    setRoles(rolesRes.data || []);
    setPlans(plansRes.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const getUserRole = (userId: string) => {
    const r = roles.find((r) => r.user_id === userId);
    return r?.role || 'user';
  };

  const getUserPlan = (userId: string) => {
    const p = plans.find((p) => p.user_id === userId);
    return p?.plan || 'free';
  };

  const updateRole = async (userId: string, newRole: string) => {
    await supabase.from('user_roles').delete().eq('user_id', userId);
    if (newRole !== 'user') {
      const { error } = await supabase.from('user_roles').insert({ user_id: userId, role: newRole as any });
      if (error) {
        toast({ title: '❌ Error', description: error.message, variant: 'destructive' });
        return;
      }
    }
    toast({ title: '✅ Role updated!' });
    fetchData();
  };

  const updatePlan = async (userId: string, newPlan: string) => {
    const { error } = await supabase
      .from('user_plans')
      .update({ plan: newPlan as any })
      .eq('user_id', userId);
    
    if (error) {
      // If no row exists, insert
      const { error: insertError } = await supabase
        .from('user_plans')
        .insert({ user_id: userId, plan: newPlan as any });
      if (insertError) {
        toast({ title: '❌ Error', description: insertError.message, variant: 'destructive' });
        return;
      }
    }
    toast({ title: '✅ Plan updated!' });
    fetchData();
  };

  const deleteUser = async (userId: string) => {
    // Only remove from profiles, roles, plans (can't delete from auth.users via client)
    await Promise.all([
      supabase.from('user_roles').delete().eq('user_id', userId),
      supabase.from('user_plans').delete().eq('user_id', userId),
      supabase.from('profiles').delete().eq('user_id', userId),
    ]);
    toast({ title: '✅ User data removed!' });
    fetchData();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Breadcrumb items={[{ label: 'Admin', to: '/admin' }, { label: 'Users' }]} />
      <div className="flex items-center gap-3 mb-6">
        <Users className="text-primary" size={28} />
        <h1 className="text-3xl font-bold">User Management</h1>
        <span className="retro-tag text-muted-foreground">{profiles.length} users</span>
      </div>
      <div className="brutalist-card rounded-xl bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : profiles.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No users found</TableCell></TableRow>
            ) : (
              profiles.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.display_name || 'Unknown'}</TableCell>
                  <TableCell className="font-mono text-sm">{p.email}</TableCell>
                  <TableCell>
                    <Select value={getUserPlan(p.user_id)} onValueChange={(v) => updatePlan(p.user_id, v)}>
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">
                          <span className="flex items-center gap-1">Free</span>
                        </SelectItem>
                        <SelectItem value="pro">
                          <span className="flex items-center gap-1"><Crown size={14} className="text-yellow-500" /> Pro</span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select value={getUserRole(p.user_id)} onValueChange={(v) => updateRole(p.user_id, v)}>
                      <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{new Date(p.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => deleteUser(p.user_id)}>
                      <Trash2 size={16} className="text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminUsers;
