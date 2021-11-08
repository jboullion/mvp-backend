import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { DeleteResult } from 'typeorm';
import { CreateJobDto } from './dto/create-job.dto';
import { GetJobsFilterDto } from './dto/get-jobs-filter.dto';
import { JobStatus } from './job-status.enum';
import { Job } from './job.entity';
import { JobsRepository } from './jobs.repository';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(JobsRepository) private jobsRepository: JobsRepository,
  ) {}

  async getJobs(filterDto: GetJobsFilterDto, user: User): Promise<Job[]> {
    return await this.jobsRepository.getJobs(filterDto, user);
  }

  async getJobById(uuid: string, user: User): Promise<Job> {
    const job = await this.jobsRepository.findOne({
      uuid: uuid,
      user,
    });

    if (!job) {
      throw new NotFoundException(`Job ${uuid} not found`);
    }

    return job;
  }

  async createJob(createJobDto: CreateJobDto, user: User): Promise<Job> {
    return await this.jobsRepository.createJob(createJobDto, user);
  }

  async updateJobStatus(
    uuid: string,
    status: JobStatus,
    user: User,
  ): Promise<Job> {
    const job = await this.getJobById(uuid, user);

    if (job) {
      job.status = status;
      await this.jobsRepository.save(job);
      return job;
    }

    throw new NotFoundException(`Job ${uuid} not found`);
  }

  async deleteJob(uuid: string, user: User): Promise<void> {
    const deleteResult: DeleteResult = await this.jobsRepository.deleteJob(
      uuid,
      user,
    );

    if (!deleteResult.affected) {
      throw new NotFoundException(`Job ${uuid} not found`);
    }
  }
}
