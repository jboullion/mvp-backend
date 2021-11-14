import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { GetJobsFilterDto } from './dto/get-jobs-filter.dto';
import { UpdateJobStatusDto } from './dto/update-job-status.dto';
import { JobStatus } from './job-status.enum';
import { Job } from './job.entity';
import { JobsService } from './jobs.service';
import { Logger } from '@nestjs/common';

@Controller('jobs')
@UseGuards(AuthGuard())
export class JobsController {
  private logger = new Logger('JobsController', { timestamp: true });

  constructor(private jobsService: JobsService) {}

  @Get('/:uuid')
  async getJobByUUID(
    @Param('uuid') uuid: string,
    @GetUser() user: User,
  ): Promise<Job> {
    return await this.jobsService.getJobById(uuid, user);
  }

  @Get()
  async getJobs(
    @Query() filterDto: GetJobsFilterDto,
    @GetUser() user: User,
  ): Promise<Job[]> {
    return await this.jobsService.getJobs(filterDto, user);
  }

  @Post()
  createJob(
    @Body() createJobDto: CreateJobDto,
    @GetUser() user: User,
  ): Promise<Job> {
    this.logger.verbose(
      `User ${user.email} creating a job: ${JSON.stringify(createJobDto)}`,
    );
    return this.jobsService.createJob(createJobDto, user);
  }

  @Patch('/:uuid/status')
  updateJobStatus(
    @Param('uuid') uuid: string,
    @Body() updateJobStatusDto: UpdateJobStatusDto,
    @GetUser() user: User,
  ): Promise<Job> {
    const { status } = updateJobStatusDto;
    return this.jobsService.updateJobStatus(uuid, status, user);
  }

  @Delete('/:uuid')
  deleteJob(@Param('uuid') uuid: string, @GetUser() user: User): Promise<void> {
    return this.jobsService.deleteJob(uuid, user);
  }

  // @Patch(':id')
  // updateJob(
  //   @Param('id') id: string,
  //   @Body() createJobDto: CreateJobDto,
  // ): Job | boolean {
  //   const job = this.jobsService.updateJob(id, createJobDto);
  //   return job;
  // }
}
