import {
  IsDefined,
  IsInt,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class CreateTrackDto {
  @IsDefined()
  @IsString()
  name: string;
  @IsDefined()
  @ValidateIf((object) => object.artistId !== null)
  @IsUUID('4')
  artistId: string | null;
  @IsDefined()
  @ValidateIf((object) => object.artistId !== null)
  @IsUUID('4')
  albumId: string | null;

  @IsDefined()
  @IsInt()
  duration: number;
}
