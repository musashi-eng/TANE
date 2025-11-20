import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MinLength, MaxLength, IsEnum, IsInt, Min, Max } from 'class-validator';

/**
 * タスク作成用のDTO
 */
export class CreateTaskDto {
  @ApiProperty({
    description: 'タスク名',
    example: 'プロジェクト計画書の作成',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'タスクの説明',
    example: 'Q1のプロジェクト計画書を作成する',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: '優先度',
    enum: ['low', 'medium', 'high'],
    example: 'medium',
  })
  @IsEnum(['low', 'medium', 'high'])
  priority: string;

  @ApiProperty({
    description: '見積もり時間（時間）',
    type: 'integer',
    minimum: 1,
    maximum: 100,
    example: 8,
  })
  @IsInt()
  @Min(1)
  @Max(100)
  estimatedHours: number;
}
