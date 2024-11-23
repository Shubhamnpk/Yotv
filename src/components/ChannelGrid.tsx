import React, { useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useInView } from 'react-intersection-observer';
import type { Channel } from '../types';
import ChannelCard from './ChannelCard';
import useStore from '../store/useStore';

interface ChannelGridProps {
  channels: Channel[];
  onChannelSelect: (channel: Channel) => void;
}

export default function ChannelGrid({ channels, onChannelSelect }: ChannelGridProps) {
  const { settings } = useStore();
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const favoriteChannels = useMemo(() => 
    channels.filter(channel => settings.favorites.includes(channel.id)),
    [channels, settings.favorites]
  );

  const [columnCount, setColumnCount] = React.useState(Math.floor((window.innerWidth - 48) / 300));

  React.useEffect(() => {
    const handleResize = () => setColumnCount(Math.floor((window.innerWidth - 48) / 300));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const favoriteParentRef = React.useRef<HTMLDivElement>(null);
  const allChannelsParentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: Math.ceil(channels.length / columnCount),
    getScrollElement: () => allChannelsParentRef.current,
    estimateSize: () => 300,
    overscan: 5,
  });

  const favoriteRowVirtualizer = useVirtualizer({
    count: Math.ceil(favoriteChannels.length / columnCount),
    getScrollElement: () => favoriteParentRef.current,
    estimateSize: () => 300,
    overscan: 5,
  });

  return (
    <div ref={ref} className="space-y-8">
      {favoriteChannels.length > 0 && inView && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Favorites</h2>
          <div
            ref={favoriteParentRef}
            className="h-[600px] overflow-auto"
          >
            <div
              style={{
                height: `${favoriteRowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {favoriteRowVirtualizer.getVirtualItems().map((virtualRow) => {
                const startIndex = virtualRow.index * columnCount;
                const channelSlice = favoriteChannels.slice(startIndex, startIndex + columnCount);

                return (
                  <div
                    key={virtualRow.key}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  >
                    {channelSlice.map((channel) => (
                      <ChannelCard
                        key={channel.id}
                        channel={channel}
                        onClick={() => onChannelSelect(channel)}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {inView && (
        <section>
          <h2 className="text-xl font-semibold mb-4">All Channels</h2>
          <div
            ref={allChannelsParentRef}
            className="h-[600px] overflow-auto"
          >
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const startIndex = virtualRow.index * columnCount;
                const channelSlice = channels.slice(startIndex, startIndex + columnCount);

                return (
                  <div
                    key={virtualRow.key}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  >
                    {channelSlice.map((channel) => (
                      <ChannelCard
                        key={channel.id}
                        channel={channel}
                        onClick={() => onChannelSelect(channel)}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
