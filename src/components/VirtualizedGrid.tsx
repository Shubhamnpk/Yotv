import { FixedSizeGrid } from 'react-window';
import type { Channel } from '../types';
import ChannelCard from './ChannelCard';

interface VirtualizedGridProps {
  channels: Channel[];
  onChannelSelect: (channel: Channel) => void;
}

export default function VirtualizedGrid({ channels, onChannelSelect }: VirtualizedGridProps) {
  const columnCount = Math.floor(window.innerWidth / 300) || 1;
  const rowCount = Math.ceil(channels.length / columnCount);
  const cellWidth = Math.floor(window.innerWidth / columnCount);
  const cellHeight = 300;

  const Cell = ({ columnIndex, rowIndex, style }: any) => {
    const index = rowIndex * columnCount + columnIndex;
    const channel = channels[index];

    if (!channel) return null;

    return (
      <div style={style} className="p-4">
        <ChannelCard channel={channel} onClick={() => onChannelSelect(channel)} />
      </div>
    );
  };

  return (
    <FixedSizeGrid
      columnCount={columnCount}
      columnWidth={cellWidth}
      height={window.innerHeight - 200}
      rowCount={rowCount}
      rowHeight={cellHeight}
      width={window.innerWidth - 256} // Subtract sidebar width
    >
      {Cell}
    </FixedSizeGrid>
  );
}