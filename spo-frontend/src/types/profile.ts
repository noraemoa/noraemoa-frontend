export interface UserTasteProfileCreateRequest {
  answers: BalanceAnswer[];
}

export interface BalanceAnswer {
  questionText: string;
  choiceText: string;
  choiceKey: string;
}

export interface TrackSematicSearchItem {
  trackId: number;
  spotifyId: string;
  name: string;
  artist: string;
  album: string;
  imageUrl: string;
  durationMs: number;
  score: number;
}

export interface UserTasteProfileResponse {
  tracks: TrackSematicSearchItem[];
  profileSummary: string;
  profileTypeName: string;
  profileOneLiner: string;
}
