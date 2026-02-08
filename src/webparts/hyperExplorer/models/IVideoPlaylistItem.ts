import type { VideoSourceType } from "./IExplorerEnums";

/** Video playlist item */
export interface IVideoPlaylistItem {
  /** Unique ID */
  id: string;
  /** Video title */
  title: string;
  /** Video URL */
  url: string;
  /** Source type */
  type: VideoSourceType;
  /** Thumbnail URL */
  thumbnailUrl?: string;
  /** Duration display string e.g. "3:45" */
  duration?: string;
  /** Whether currently playing */
  isPlaying: boolean;
}
