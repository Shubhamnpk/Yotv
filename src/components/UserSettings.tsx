import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Camera, Mail, Key, History } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, storage } from '../lib/firebase';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import useStore from '../store/useStore';

export default function UserSettings() {
  const [user] = useAuthState(auth);
  const { settings } = useStore();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !user) return;
    
    setIsUploading(true);
    try {
      const file = e.target.files[0];
      const storageRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);
      await updateProfile(user, { photoURL });
    } catch (error) {
      console.error('Error uploading image:', error);
    }
    setIsUploading(false);
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    try {
      await updateProfile(user, { displayName });
      // Handle password update separately if needed
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-6">
        <div className="relative">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700"
          >
            <img
              src={user?.photoURL || `https://ui-avatars.com/api/?name=${displayName}`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <label className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full cursor-pointer
            hover:bg-blue-600 transition-colors">
            <Camera className="w-4 h-4 text-white" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={isUploading}
            />
          </label>
        </div>

        <div>
          <h2 className="text-xl font-semibold">
            {user?.displayName || 'Guest User'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {user?.email || 'Not signed in'}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <label className="block">
            <span className="flex items-center gap-2 text-sm font-medium mb-2">
              <User className="w-4 h-4" />
              Display Name
            </span>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="block">
            <span className="flex items-center gap-2 text-sm font-medium mb-2">
              <Mail className="w-4 h-4" />
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
              disabled={!user}
            />
          </label>

          <label className="block">
            <span className="flex items-center gap-2 text-sm font-medium mb-2">
              <Key className="w-4 h-4" />
              New Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
              placeholder="Leave blank to keep current password"
            />
          </label>
        </div>

        <button
          onClick={handleUpdateProfile}
          className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600
            transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!user}
        >
          Update Profile
        </button>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Watch History</h3>
        </div>
        
        <div className="space-y-2">
          {settings.watchHistory.map((item) => (
            <div
              key={`${item.channelId}-${item.timestamp}`}
              className="flex items-center justify-between p-3 rounded-lg
                bg-gray-50 dark:bg-gray-800/50"
            >
              <div>
                <p className="font-medium">{item.channelId}</p>
                <p className="text-sm text-gray-500">
                  {new Date(item.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}