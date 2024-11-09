import { ApiProperty } from '@nestjs/swagger';

export class Album {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique identifier for the album',
  })
  id: string;

  @ApiProperty({
    example: 'In Rainbows',
    description: 'The name of the album',
  })
  name: string;

  @ApiProperty({
    example: 2007,
    description: 'The year the album was released',
  })
  year: number;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'The UUID of the artist who created the album',
    nullable: true,
  })
  artistId: string | null;
}
