import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsInt,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class UpdateAlbumDto {
  @ApiProperty({
    description: 'The name of the album',
    example: '2+2=5',
  })
  @IsDefined({ message: 'Name is required' })
  @IsString({ message: 'Name should be string' })
  name: string;

  @ApiProperty({
    description: 'The release year of the album',
    example: 2003,
  })
  @IsDefined({ message: 'Year is required' })
  @IsInt({ message: 'Year should be integer' })
  year: number;

  @ApiProperty({
    description: 'The UUID of the artist associated with the album',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsDefined({ message: 'Artist ID is required' })
  @ValidateIf((object) => object.artistId !== null)
  @IsUUID('4', { message: 'Artist ID should be a valid UUID' })
  artistId: string | null;
}
