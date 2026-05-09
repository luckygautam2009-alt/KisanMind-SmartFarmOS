import { User, Mail, Phone, MapPin, Edit3, Shield, Key, Camera } from 'lucide-react';
import { useLocation } from '../contexts/LocationContext';
import { useUser } from '../contexts/UserContext';
import { useRef, useState } from 'react';
import { uploadToCloudinary } from '../lib/cloudinary';

export function Profile() {
  const { location } = useLocation();
  const { user, firebaseUser, updateFarmDetails, updateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleSaveFarm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firebaseUser) {
      setProfileMessage('Sign in to save farm details.');
      return;
    }
    const formData = new FormData(e.currentTarget);
    await updateFarmDetails({
      totalLand: (formData.get('totalLand') as string) || '',
      primaryCrop: (formData.get('primaryCrop') as string) || '',
      secondaryCrop: (formData.get('secondaryCrop') as string) || '',
      soilType: (formData.get('soilType') as string) || '',
    });
    setIsEditing(false);
    setProfileMessage('Farm details saved.');
  };

  const handleSavePersonal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firebaseUser) {
      setProfileMessage('Sign in to update your profile.');
      return;
    }
    const formData = new FormData(e.currentTarget);
    setSavingProfile(true);
    setProfileMessage(null);
    try {
      await updateUser({
        name: (formData.get('displayName') as string) || user?.name || '',
        phone: (formData.get('phone') as string) || '',
      });
      setEditingProfile(false);
      setProfileMessage('Profile updated.');
    } catch (err: unknown) {
      setProfileMessage(err instanceof Error ? err.message : 'Could not save profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePhotoPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !firebaseUser) {
      if (!firebaseUser) setProfileMessage('Sign in to set a profile photo.');
      return;
    }
    setProfileMessage(null);
    const url = await uploadToCloudinary(file);
    if (url) {
      await updateUser({ photoURL: url });
      setProfileMessage('Profile photo updated.');
    } else {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const dataUrl = reader.result as string;
        if (dataUrl.length > 900_000) {
          setProfileMessage('Image is too large. Configure Cloudinary or use a smaller photo.');
          return;
        }
        await updateUser({ photoURL: dataUrl });
        setProfileMessage('Profile photo saved (local data URL).');
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto flex-1 w-full flex flex-col pt-6 pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Farmer Profile</h1>
        <p className="text-slate-600 dark:text-slate-400">Manage your farm details and account settings.</p>
      </div>

      {profileMessage && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-brand-50 dark:bg-brand-900/30 text-brand-800 dark:text-brand-200 text-sm font-medium border border-brand-200 dark:border-brand-800">
          {profileMessage}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column - Avatar & Basic Info */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col items-center text-center">
          <input
            type="file"
            ref={photoInputRef}
            className="hidden"
            accept="image/*"
            onChange={handlePhotoPick}
          />
          <div className="relative mb-4">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-brand-500/20 bg-slate-200 flex items-center justify-center">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
              ) : (
                <User className="w-16 h-16 text-slate-400" />
              )}
            </div>
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              disabled={!firebaseUser}
              title={firebaseUser ? 'Change photo' : 'Sign in to upload'}
              className="absolute bottom-0 right-0 w-10 h-10 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 text-white rounded-full flex items-center justify-center border-4 border-slate-50 dark:border-slate-950 transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user?.name || 'Guest'}</h2>
          <p className="text-brand-600 dark:text-brand-400 font-medium mb-4">{user?.membership || '—'}</p>

          <div className="w-full space-y-3 mt-4 text-sm text-left">
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <Phone className="w-4 h-4 text-brand-500" />
              <span>{user?.phone || '—'}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <Mail className="w-4 h-4 text-brand-500" />
              <span className="truncate max-w-[150px] sm:max-w-none">{user?.email || '—'}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <MapPin className="w-4 h-4 text-brand-500" />
              <span>{location.city ? `${location.city}, ${location.state}` : 'Locating...'}</span>
            </div>
          </div>
        </div>

        {/* Right Column - Farm Details & Security */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSavePersonal} className="glass-panel p-6 rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-brand-500" /> Personal details
              </h3>
              {!editingProfile && (
                <button
                  type="button"
                  onClick={() => setEditingProfile(true)}
                  disabled={!firebaseUser}
                  className="text-brand-600 hover:text-brand-700 disabled:opacity-40 text-sm font-semibold flex items-center gap-1"
                >
                  <Edit3 className="w-4 h-4" /> Edit
                </button>
              )}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Display name</label>
                <input
                  name="displayName"
                  disabled={!editingProfile}
                  type="text"
                  defaultValue={user?.name || ''}
                  className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white disabled:opacity-70"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Phone</label>
                <input
                  name="phone"
                  disabled={!editingProfile}
                  type="tel"
                  defaultValue={user?.phone || ''}
                  placeholder="+91 ..."
                  className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white disabled:opacity-70"
                />
              </div>
            </div>
            {editingProfile && (
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProfile(false)}
                  className="px-6 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 transition-all"
                >
                  {savingProfile ? 'Saving…' : 'Save profile'}
                </button>
              </div>
            )}
          </form>

          <form onSubmit={handleSaveFarm} className="glass-panel p-6 rounded-3xl">
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
                <button type="submit" className="px-6 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 transition-all">Save farm details</button>
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
