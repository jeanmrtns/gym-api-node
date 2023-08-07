import { Prisma, CheckIn } from '@prisma/client';

export interface CheckInsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
  getMetricsByUserId(userId: string): Promise<number>;
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>;
  findAllByUserId(userId: string, page: number): Promise<CheckIn[]>;
}
