import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    example: 'password123',
    description: 'The current password of the user',
  })
  @IsNotEmpty({ message: 'oldPassword is required' })
  oldPassword: string;

  @ApiProperty({
    example: 'password456',
    description: 'The new password the user wants to set',
  })
  @IsNotEmpty({ message: 'newPassword is required' })
  newPassword: string;
}
