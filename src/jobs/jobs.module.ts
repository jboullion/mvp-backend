import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { JobsController } from './jobs.controller';
import { JobsRepository } from './jobs.repository';
import { JobsService } from './jobs.service';

@Module({
  imports: [TypeOrmModule.forFeature([JobsRepository]), AuthModule],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
