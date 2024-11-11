import { ApiProperty } from '@nestjs/swagger';
import { CreateArtistDto } from './create-artist.dto';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateArtistDto extends CreateArtistDto {
  @ApiProperty({ example: 'Adele', description: 'The name of artist' })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  name: string;

  @ApiProperty({
    example: true,
    description: 'Indicates whether the artist has won a Grammy award.',
  })
  @IsBoolean()
  @IsNotEmpty({ message: 'Grammy is required' })
  grammy: boolean;
}
