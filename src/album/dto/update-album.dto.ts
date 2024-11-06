import {
  IsDefined,
  IsInt,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class UpdateAlbumDto {
  @IsDefined({ message: 'Name is required' })
  @IsString({ message: 'Name should be string' })
  name: string;

  @IsDefined({ message: 'Year is required' })
  @IsInt({ message: 'Year should be integer' })
  year: number;

  @IsDefined({ message: 'Artist ID is required' })
  @ValidateIf((object) => object.artistId !== null)
  @IsUUID('4', { message: 'Artist ID should be a valid UUID' })
  artistId: string | null;
}
