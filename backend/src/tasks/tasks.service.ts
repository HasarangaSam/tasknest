import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { TaskPriority, TaskStatus } from '../generated/prisma/client.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { TaskQueryDto } from './dto/task-query.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        title: createTaskDto.title.trim(),
        description: createTaskDto.description?.trim() || null,
        priority: createTaskDto.priority ?? TaskPriority.MEDIUM,
        dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null,
        userId,
      },
    });
  }

  async findAll(userId: number, role: 'USER' | 'ADMIN', query: TaskQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where = {
      ...(role === 'USER' ? { userId } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.priority ? { priority: query.priority } : {}),
    };

    const [tasks, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [query.sortBy ?? 'createdAt']: query.order ?? 'desc',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      data: tasks,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(taskId: number, userId: number, role: 'USER' | 'ADMIN') {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    this.checkOwnership(task.userId, userId, role);

    return task;
  }

  async update(
    taskId: number,
    userId: number,
    role: 'USER' | 'ADMIN',
    updateTaskDto: UpdateTaskDto,
  ) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    this.checkOwnership(task.userId, userId, role);

    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        ...(updateTaskDto.title !== undefined
          ? { title: updateTaskDto.title.trim() }
          : {}),
        ...(updateTaskDto.description !== undefined
          ? { description: updateTaskDto.description.trim() || null }
          : {}),
        ...(updateTaskDto.status !== undefined
          ? { status: updateTaskDto.status }
          : {}),
        ...(updateTaskDto.priority !== undefined
          ? { priority: updateTaskDto.priority }
          : {}),
        ...(updateTaskDto.dueDate !== undefined
          ? { dueDate: new Date(updateTaskDto.dueDate) }
          : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(taskId: number, userId: number, role: 'USER' | 'ADMIN') {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    this.checkOwnership(task.userId, userId, role);

    await this.prisma.task.delete({
      where: { id: taskId },
    });

    return {
      message: 'Task deleted successfully',
    };
  }

  private checkOwnership(
    taskUserId: number,
    currentUserId: number,
    role: 'USER' | 'ADMIN',
  ) {
    if (role === 'ADMIN') {
      return;
    }

    if (taskUserId !== currentUserId) {
      throw new ForbiddenException('You do not have access to this task');
    }
  }
}
