import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { authService } from '@/lib/rbac';
import { api } from '@/lib/api-client';

type User = ReturnType<typeof authService.getCurrentUser> extends infer U ? (U extends null ? never : U) : never;

const Profile = () => {
  const [user, setUser] = useState<User | null>(authService.getCurrentUser());
  const [adminPing, setAdminPing] = useState<string>('');

  useEffect(() => {
    if (!user) {
      authService.fetchProfile().then(setUser).catch(() => setUser(null));
    }
  }, []);

  const handleAdminPing = async () => {
    try {
      const res = await api.getRisk<{ pong: boolean }>(`/admin/ping`);
      setAdminPing(`Admin ping: ${res.pong ? 'OK (200)' : 'Unexpected'}`);
    } catch (e: any) {
      setAdminPing(`Admin ping failed: ${e?.message ?? 'Error'}`);
    }
  };

  return (
    <div className="p-6">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <div className="space-y-2">
              <div><strong>Email:</strong> {user.email}</div>
              <div><strong>Role:</strong> {user.role}</div>
              <Button onClick={handleAdminPing} className="mt-4">Test Admin Endpoint</Button>
              {adminPing && <div className="text-sm text-muted-foreground mt-2">{adminPing}</div>}
            </div>
          ) : (
            <div>Loading profile…</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;

