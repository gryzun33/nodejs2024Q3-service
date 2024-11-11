import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateArtistDto {
  @ApiProperty({ example: 'Thom Yorke', description: 'The name of artist' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({
    example: true,
    description: 'Indicates whether the artist has won a Grammy award.',
  })
  @IsNotEmpty({ message: 'Grammy is required' })
  grammy: boolean;
}
