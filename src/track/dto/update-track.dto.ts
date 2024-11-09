import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsInt,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';
export class UpdateTrackDto {
  @ApiProperty({
    example: '15 step',
    description: 'The name of the track',
  })
  @IsDefined({ message: 'Name is required' })
  @IsString({ message: 'Name should be a string' })
  name: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'The UUID of the artist who created the track. Can be null.',
    nullable: true,
  })
  @IsDefined({ message: 'Artist ID is required' })
  @ValidateIf((object) => object.artistId !== null)
  @IsUUID('4', { message: 'Artist ID should be a valid UUID' })
  artistId: string | null;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description:
      'The UUID of the album to which the track belongs. Can be null.',
    nullable: true,
  })
  @IsDefined({ message: 'Album ID is required' })
  @ValidateIf((object) => object.albumId !== null)
  @IsUUID('4', { message: 'Album ID should be a valid UUID' })
  albumId: string | null;

  @ApiProperty({
    example: 220,
    description: 'Duration of the track in seconds',
  })
  @IsDefined({ message: 'Duration is required' })
  @IsInt({ message: 'Duration should be an integer' })
  duration: number;
}
