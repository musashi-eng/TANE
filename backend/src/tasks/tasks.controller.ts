import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateTaskDto, TaskDto } from './dto';

/**
 * タスク管理用のコントローラー（サンプル実装）
 */
@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  @Get()
  @ApiOperation({
    summary: 'タスク一覧取得',
    description: '全てのタスクを取得します',
  })
  @ApiResponse({
    status: 200,
    description: 'タスク一覧取得成功',
    type: [TaskDto],
  })
  findAll(): TaskDto[] {
    // サンプル実装
    return [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'プロジェクト計画書の作成',
        description: 'Q1のプロジェクト計画書を作成する',
        priority: 'high',
        estimatedHours: 8,
        createdAt: new Date('2025-01-01T00:00:00Z'),
        updatedAt: new Date('2025-01-01T00:00:00Z'),
      },
    ];
  }

  @Get(':id')
  @ApiOperation({
    summary: 'タスク詳細取得',
    description: '指定されたIDのタスクを取得します',
  })
  @ApiResponse({
    status: 200,
    description: 'タスク取得成功',
    type: TaskDto,
  })
  @ApiResponse({
    status: 404,
    description: 'タスクが見つかりません',
  })
  findOne(@Param('id') id: string): TaskDto {
    // サンプル実装
    return {
      id,
      name: 'プロジェクト計画書の作成',
      description: 'Q1のプロジェクト計画書を作成する',
      priority: 'high',
      estimatedHours: 8,
      createdAt: new Date('2025-01-01T00:00:00Z'),
      updatedAt: new Date('2025-01-01T00:00:00Z'),
    };
  }

  @Post()
  @ApiOperation({
    summary: 'タスク作成',
    description: '新しいタスクを作成します',
  })
  @ApiResponse({
    status: 201,
    description: 'タスク作成成功',
    type: TaskDto,
  })
  @ApiResponse({
    status: 400,
    description: 'バリデーションエラー',
  })
  create(@Body() createTaskDto: CreateTaskDto): TaskDto {
    // サンプル実装
    return {
      id: '123e4567-e89b-12d3-a456-426614174000',
      ...createTaskDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
