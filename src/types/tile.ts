export type TileStatus = 'available' | 'sold' | 'reserved' | 'pending';

export interface Tile {
  id: string;
  x: number;
  y: number;
  status: TileStatus;
  ownerId?: string;
  imageUrl?: string;
  linkUrl?: string;
  title?: string;
  wallType: 'premium' | 'community';
}

export interface WallStats {
  totalTiles: number;
  soldTiles: number;
  remainingTiles: number;
  revenue?: number;
}

export interface User {
  id: string;
  username: string;
  display_name?: string;
  avatarUrl?: string;
  bio?: string;
  referral_code?: string;
  referral_stats?: {
    clicks: number;
    signups: number;
    conversions: number;
    total_earned: number;
  };
  links: {
    label: string;
    url: string;
  }[];
}

export interface Purchase {
  id: string;
  tileId: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}
