import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { DeleteResult, EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserStatus } from './user-status.enum';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

enum UserRepoErrorCodes {
  EMAIL_EXISTS = '23505',
}

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  private logger = new Logger('UsersRepository', { timestamp: true });

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { email, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({
      email,
      password: hashedPassword,
      status: UserStatus.UNACTIVATED,
    });

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === UserRepoErrorCodes.EMAIL_EXISTS) {
        throw new ConflictException('Email already in use');
      } else {
        this.logger.error(
          `createUser failed for email ${email}. Credentials: ${JSON.stringify({
            authCredentialsDto,
          })}`,
          error.stack,
        );
        throw new InternalServerErrorException();
      }
    }

    return user;
  }

  //   async getJobs(filterDto: GetJobsFilterDto): Promise<Job[]> {
  //     const { search, status } = filterDto;
  //     const query = this.createQueryBuilder('job');
  //     if (status) {
  //       query.andWhere('job.status = :status', { status });
  //     }
  //     if (search) {
  //       // NOTE: For case insensative queries you can use ILIKE
  //       // NOTE: For improved performance creating an index on idx_title = LOWER(title)  can be helpful
  //       query.andWhere(
  //         'LOWER(job.title) LIKE :search OR LOWER(job.description) LIKE :search',
  //         { search: `%${search.toLowerCase()}%` },
  //       );
  //     }
  //     const jobs = await query.getMany();
  //     return jobs;
  //   }
  //   async createJob(createJobDto: CreateJobDto): Promise<Job> {
  //     const { title, description } = createJobDto;
  //     const job = this.create({
  //       title,
  //       description,
  //       status: JobStatus.OPEN,
  //     });
  //     await this.save(job);
  //     return job;
  //   }
  //   async deleteJob(id: string): Promise<DeleteResult> {
  //     return await this.delete(id);
  //   }
}
