import { IsEnum, IsOptional, IsString } from 'class-validator';
import { JobStatus } from '../job-status.enum';

export class GetJobsFilterDto {
  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;
  @IsOptional()
  @IsString()
  search?: string;
}
