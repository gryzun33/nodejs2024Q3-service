import { ApiProperty } from '@nestjs/swagger';
import { Album } from 'src/album/entities/album.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Track } from 'src/track/entities/track.entity';

export class FavoritesResponse {
  @ApiProperty({
    type: [Artist],
    description: 'List of favorite artists',
    example: [
      { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Radiohead' },
    ],
  })
  artists: Artist[];

  @ApiProperty({
    type: [Album],
    description: 'List of favorite albums',
    example: [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'In Rainbows',
        year: 2007,
      },
    ],
  })
  albums: Album[];

  @ApiProperty({
    type: [Track],
    description: 'List of favorite tracks',
    example: [
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Jigsaw falling into place',
        duration: 240,
      },
    ],
  })
  tracks: Track[];
}

export interface Favorites {
  artists: string[];
  albums: string[];
  tracks: string[];
}
