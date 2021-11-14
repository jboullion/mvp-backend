import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateJobDto {
  @IsNotEmpty()
  title: string;

  @IsString()
  @MaxLength(255)
  description: string;
}
