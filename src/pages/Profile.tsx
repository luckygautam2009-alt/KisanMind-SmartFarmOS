import { User, Mail, Phone, MapPin, Edit3, Shield, Key } from 'lucide-react';
import { useLocation } from '../contexts/LocationContext';
import { useUser } from '../contexts/UserContext';
import { useState } from 'react';

export function Profile() {
  const { location } = useLocation();
  const { user, updateFarmDetails, updateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateFarmDetails({
      totalLand: formData.get('totalLand') as string,
      primaryCrop: formData.get('primaryCrop') as string,
      secondaryCrop: formData.get('secondaryCrop') as string,
      soilType: formData.get('soilType') as string,
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto flex-1 w-full flex flex-col pt-6 pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Farmer Profile</h1>
        <p className="text-slate-600 dark:text-slate-400">Manage your farm details and account settings.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column - Avatar & Basic Info */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-brand-500/20 bg-slate-200 flex items-center justify-center">
              <User className="w-16 h-16 text-slate-400" />
            </div>
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-brand-600 hover:bg-brand-500 text-white rounded-full flex items-center justify-center border-4 border-slate-50 dark:border-slate-950 transition-colors">
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user?.name}</h2>
          <p className="text-brand-600 dark:text-brand-400 font-medium mb-4">{user?.membership}</p>

          <div className="w-full space-y-3 mt-4 text-sm text-left">
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <Phone className="w-4 h-4 text-brand-500" />
              <span>{user?.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <Mail className="w-4 h-4 text-brand-500" />
              <span className="truncate max-w-[150px] sm:max-w-none">{user?.email}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <MapPin className="w-4 h-4 text-brand-500" />
              <span>{location.city ? `${location.city}, ${location.state}` : 'Locating...'}</span>
            </div>
          </div>
        </div>

        {/* Right Column - Farm Details & Security */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="glass-panel p-6 rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-brand-500" /> Farm Details
              </h3>
              {!isEditing && (
                <button type="button" onClick={() => setIsEditing(true)} className="text-brand-600 hover:text-brand-700 text-sm font-semibold flex items-center gap-1">
                  <Edit3 className="w-4 h-4" /> Edit
                </button>
              )}
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 border-none">Total Land (Acres)</label>
                <input name="totalLand" disabled={!isEditing} type="text" defaultValue={user?.farmDetails.totalLand} className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white disabled:opacity-70" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Primary Crop</label>
                <input name="primaryCrop" disabled={!isEditing} type="text" defaultValue={user?.farmDetails.primaryCrop} className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white disabled:opacity-70" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Secondary Crop</label>
                <input name="secondaryCrop" disabled={!isEditing} type="text" defaultValue={user?.farmDetails.secondaryCrop} className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white disabled:opacity-70" />
              </div>
               <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Soil Type</label>
                <input name="soilType" disabled={!isEditing} type="text" defaultValue={user?.farmDetails.soilType} className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white disabled:opacity-70" />
              </div>
            </div>
            {isEditing && (
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-all">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 transition-all">Save Changes</button>
              </div>
            )}
          </form>

          <div className="glass-panel p-6 rounded-3xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-brand-500" /> Account Security
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">Password</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Last updated 3 months ago</p>
                </div>
                <button className="px-4 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm font-semibold transition-colors text-slate-800 dark:text-slate-200">Change</button>
              </div>
              <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">Two-Factor Auth</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Currently enabled via SMS</p>
                </div>
                <button className="px-4 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm font-semibold transition-colors text-slate-800 dark:text-slate-200">Manage</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
