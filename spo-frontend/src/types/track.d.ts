export interface Track {
  trackId: number
  spotifyID: string
  name: string
  artist: string
  album: string
  durationMs: number
}

export interface TrackCreateRequestDto {
  spotifyId: string
  name: string
  artist?: string
  album: string
  imageUrl?: string
  durationMs: number
}
