import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UserStatus } from '../auth/user-status.enum';
import { User } from '../auth/user.entity';
import { JobStatus } from './job-status.enum';
import { Job } from './job.entity';
import { JobsRepository } from './jobs.repository';
import { JobsService } from './jobs.service';

const mockJobsRepository = () => ({
  getJobs: jest.fn(),
  findOne: jest.fn(),
});

const mockUser: User = {
  username: 'James',
  id: 10,
  password: 'password',
  jobs: [],
  status: UserStatus.ACTIVATED,
};

const mockJob: Job = {
  id: '10',
  title: 'Mock Job Title',
  description: 'Mock Job Description',
  user: mockUser,
  status: JobStatus.OPEN,
};

describe('JobService', () => {
  let jobsService: JobsService;
  let jobsRepository;

  beforeEach(async () => {
    // initialize a nestjs module with a jobService and jobRepository
    const module = await Test.createTestingModule({
      providers: [
        JobsService,
        {
          provide: JobsRepository,
          useFactory: mockJobsRepository,
        },
      ],
    }).compile();

    jobsService = await module.get(JobsService);
    jobsRepository = await module.get(JobsRepository);
  });

  describe('getJobs', () => {
    it('calls JobRepository.getJobs and returns an array of jobs', async () => {
      jobsRepository.getJobs.mockResolvedValue('someValue');
      const result = await jobsService.getJobs(null, mockUser);

      expect(result).toEqual('someValue');
    });
  });

  describe('getJobById', () => {
    it('calls JobRepository.findOne and return a job', async () => {
      jobsRepository.findOne.mockResolvedValue(mockJob);
      const result = await jobsService.getJobById('1', mockUser);

      expect(result).toEqual(mockJob);
    });

    it('calls JobRepository.findOne and throws an error', async () => {
      jobsRepository.findOne.mockResolvedValue(null);

      expect(jobsService.getJobById('1', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
