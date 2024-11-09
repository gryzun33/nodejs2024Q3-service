import { ApiProperty } from '@nestjs/swagger';

export class Track {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique identifier for the track',
  })
  id: string;

  @ApiProperty({
    example: 'Jigsaw falling into place',
    description: 'The name of the track',
  })
  name: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'The UUID of the artist who created the track',
    nullable: true,
  })
  artistId: string | null;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'The UUID of the album to which the track belongs',
    nullable: true,
  })
  albumId: string | null;

  @ApiProperty({
    example: 240,
    description: 'Duration of the track in seconds',
  })
  duration: number;
}
