import { ApiProperty } from '@nestjs/swagger';

export class Artist {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique identifier for the artist',
  })
  id: string;
  @ApiProperty({ example: 'Billie Eilish ', description: 'The name of artist' })
  name: string;
  @ApiProperty({
    example: true,
    description: 'Indicates whether the artist has won a Grammy award.',
  })
  grammy: boolean;
}
