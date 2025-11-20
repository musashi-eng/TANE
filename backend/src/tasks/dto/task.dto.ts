import { ApiProperty } from '@nestjs/swagger';

/**
 * タスクレスポンス用のDTO
 */
export class TaskDto {
  @ApiProperty({
    description: 'タスクID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'タスク名',
    example: 'プロジェクト計画書の作成',
  })
  name: string;

  @ApiProperty({
    description: 'タスクの説明',
    example: 'Q1のプロジェクト計画書を作成する',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: '優先度',
    enum: ['low', 'medium', 'high'],
    example: 'medium',
  })
  priority: string;

  @ApiProperty({
    description: '見積もり時間（時間）',
    example: 8,
  })
  estimatedHours: number;

  @ApiProperty({
    description: '作成日時',
    example: '2025-01-01T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '更新日時',
    example: '2025-01-01T00:00:00Z',
  })
  updatedAt: Date;
}
