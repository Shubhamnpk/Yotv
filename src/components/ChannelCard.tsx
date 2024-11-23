import { memo } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Channel } from '../types';
import useStore from '../store/useStore';
import { cn } from '../utils/cn';

interface ChannelCardProps {
  channel: Channel;
  onClick: () => void;
}

function ChannelCard({ channel, onClick }: ChannelCardProps) {
  const { settings, toggleFavorite } = useStore();
  const isFavorite = settings.favorites.includes(channel.id);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden 
        hover:shadow-md transition-all duration-300"
    >
      <div className="aspect-video bg-gray-100 dark:bg-gray-900 relative">
        <img
          src={channel.logo}
          alt={channel.name}
          className="w-full h-full object-contain p-4"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=No+Logo';
          }}
        />
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent 
            opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(channel.id);
          }}
          className={cn(
            'absolute top-2 right-2 p-2 rounded-full',
            'bg-white/10 backdrop-blur-sm',
            'opacity-0 group-hover:opacity-100 transition-opacity duration-300',
            isFavorite ? 'text-red-500' : 'text-white hover:text-red-500'
          )}
        >
          <Heart className={cn('w-5 h-5', isFavorite && 'fill-current')} />
        </button>
      </div>

      <div 
        className="absolute inset-0 cursor-pointer"
        onClick={onClick}
      />

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
          {channel.name}
        </h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {channel.categories.slice(0, 2).map(category => (
            <span 
              key={category}
              className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 
                text-gray-600 dark:text-gray-300 rounded-full"
            >
              {category}
            </span>
          ))}
          {channel.categories.length > 2 && (
            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 
              text-gray-600 dark:text-gray-300 rounded-full"
            >
              +{channel.categories.length - 2}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default memo(ChannelCard);