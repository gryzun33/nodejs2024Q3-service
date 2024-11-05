import { CreateArtistDto } from './create-artist.dto';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateArtistDto extends CreateArtistDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  name: string;
  @IsBoolean()
  @IsNotEmpty({ message: 'Grammy is required' })
  grammy: boolean;
}
