import { LucideIcon } from 'lucide-react';
import { BlockType, BlockColorKey } from './tokens';

export type Size = 'sm' | 'md' | 'lg';

export type ColumnRatio = '1:1' | '2:1' | '1:2' | '1:1:1';

export interface BaseBlockData {
  type: BlockType;
  id?: string;
}

export interface ContentBlockData extends BaseBlockData {
  type: Exclude<BlockType, 'LAYOUT' | 'TEMPLATE'>;
}

export interface LayoutBlockData extends BaseBlockData {
  type: 'LAYOUT';
  columns: 1 | 2 | 3;
  ratio?: ColumnRatio;
}

export interface TemplateBlockData extends BaseBlockData {
  type: 'TEMPLATE';
  templateId: string;
}

export type BlockData = ContentBlockData | LayoutBlockData | TemplateBlockData;

export interface DragData {
  blockType: BlockType;
  blockData: BlockData;
}

// Props interfaces
export interface BlockIconProps {
  icon: LucideIcon;
  color: BlockColorKey;
  size?: Size;
  'aria-label'?: string;
}

export interface DraggableCardProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  preview?: React.ReactNode;
  blockData: BlockData;
  onDragStart?: (data: DragData) => void;
  onDragEnd?: () => void;
  onClick?: (data: BlockData) => void;
  className?: string;
}

export interface LayoutPreviewProps {
  columns: 1 | 2 | 3;
  ratio?: ColumnRatio;
  size?: Size;
}
