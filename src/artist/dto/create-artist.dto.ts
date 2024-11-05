import { IsNotEmpty } from 'class-validator';

export class CreateArtistDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNotEmpty({ message: 'Grammy is required' })
  grammy: boolean;
}
