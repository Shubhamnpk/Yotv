import React from 'react';
import { Trash2, X } from 'lucide-react';
import useStore from '../store/useStore';

export default function WatchHistory() {
  const { settings, clearWatchHistory, removeFromWatchHistory } = useStore();

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!settings.watchHistory || settings.watchHistory.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No watch history yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Watch History</h3>
        <button
          onClick={clearWatchHistory}
          className="flex items-center gap-2 px-3 py-1 text-sm rounded-md text-red-500
            hover:bg-red-50 dark:hover:bg-red-900/20"
          aria-label="Clear all watch history"
        >
          <Trash2 className="w-4 h-4" />
          Clear All
        </button>
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
                {formatDate(item.timestamp)}
              </p>
            </div>
            <button
              onClick={() => removeFromWatchHistory(item.channelId)}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label={`Remove ${item.channelId} from watch history`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
