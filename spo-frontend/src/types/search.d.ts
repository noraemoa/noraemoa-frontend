export interface Search {
  total: number
  items: Item[]
}

export interface Item {
  trackId: string
  name: string
  durationMs: number
  artists: Artist[]
  album: Album
}

export interface Album {
  albumId: string
  albumImages: Image[]
}

export interface Artist {
  artistId?: string
  images?: Image[]
  name: string
}

export interface Image {
  url: string
  height: number
  width: number
}
