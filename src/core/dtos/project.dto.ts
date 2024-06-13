// Core
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProjectDto {
  @ApiProperty({
    example: 'Project Title',
    description: 'The title of the project',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Project Description',
    description: 'The description of the project',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @MinLength(50)
  description: string;
}
