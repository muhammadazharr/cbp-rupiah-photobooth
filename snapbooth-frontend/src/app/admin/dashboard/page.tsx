'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [config, setConfig] = useState({ printer_ip: '', printer_port: '', cameraSource: 'laptop' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    try {
      // Fetch Analytics
      const anaRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/analytics`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const anaData = await anaRes.json();
      if (anaRes.ok) setAnalytics(anaData.data);

      // Fetch Camera Config (via specialized endpoint)
      const camRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/config/camera`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const camData = await camRes.json();
      if (camRes.ok) setConfig(prev => ({ ...prev, cameraSource: camData.data.cameraSource }));

    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    const token = localStorage.getItem('admin_token');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/config/camera`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cameraSource: config.cameraSource })
      });

      if (res.ok) {
        setMessage('Configuration saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to save configuration');
      }
    } catch (err) {
      setMessage('Error saving configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  if (loading) return <div className="p-10 text-center">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 text-black">Snapbooth Admin</h1>
          <button 
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Sessions" value={analytics?.totalSessions || 0} icon="📸" />
          <StatCard title="Photos Taken" value={analytics?.totalPhotos || 0} icon="🖼️" />
          <StatCard title="Prints Success" value={`${analytics?.printSuccessRate?.toFixed(1) || 0}%`} icon="🖨️" />
          <StatCard title="WA Sent" value={analytics?.totalWhatsappSends || 0} icon="💬" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration Form */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 text-black border-b pb-2">Configuration</h2>
            {message && (
              <div className={`p-3 rounded mb-4 text-sm ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message}
              </div>
            )}
            <form onSubmit={handleSaveConfig}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Camera Source</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded text-black"
                  value={config.cameraSource}
                  onChange={(e) => setConfig({...config, cameraSource: e.target.value})}
                >
                  <option value="laptop">Default Laptop/Integrated</option>
                  <option value="external">External USB Camera</option>
                  <option value="dslr">DSLR (via specialized API)</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Printer IP Address</label>
                <input 
                  type="text" 
                  placeholder="e.g. 192.168.1.100"
                  className="w-full p-2 border border-gray-300 rounded text-black"
                  value={config.printer_ip}
                  onChange={(e) => setConfig({...config, printer_ip: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                disabled={saving}
                className="w-full bg-indigo-600 text-white font-bold py-2 rounded hover:bg-indigo-700 transition"
              >
                {saving ? 'Saving...' : 'Save Configuration'}
              </button>
            </form>
          </div>

          {/* Top Performance */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 text-black border-b pb-2">Top Usage</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-gray-600">Most Used Template</span>
                <span className="font-bold text-indigo-600">{analytics?.topTemplate?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-gray-600">Most Used Filter</span>
                <span className="font-bold text-indigo-600">{analytics?.topFilter?.name || 'N/A'}</span>
              </div>
            </div>
            
            <div className="mt-8">
              <button 
                onClick={() => alert('Sesi Manajemen is coming soon!')}
                className="w-full border border-gray-300 text-gray-700 font-semibold py-2 rounded hover:bg-gray-50 transition"
              >
                View Detailed Session History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: any, icon: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
      <div className="text-3xl bg-indigo-50 p-3 rounded-lg">{icon}</div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800 text-black">{value}</p>
      </div>
    </div>
  );
}
