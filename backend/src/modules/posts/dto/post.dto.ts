import { IsString, IsOptional, IsArray, IsBoolean, MaxLength, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'Post content/caption',
    example: 'Beautiful day at Nahrain University! 🎓',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000, { message: 'Content cannot exceed 5000 characters' })
  content?: string;

  @ApiProperty({
    description: 'Array of media URLs',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  mediaUrls?: string[];

  @ApiProperty({
    description: 'Array of media types (image, video)',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mediaTypes?: string[];

  @ApiProperty({
    description: 'Location/place tag',
    example: 'Nahrain University, Baghdad',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;

  @ApiProperty({
    description: 'Disable comments on this post',
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  commentsDisabled?: boolean;

  @ApiProperty({
    description: 'Hide like count',
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  likesHidden?: boolean;
}

export class UpdatePostDto {
  @ApiProperty({
    description: 'Post content/caption',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  content?: string;

  @ApiProperty({
    description: 'Location/place tag',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;

  @ApiProperty({
    description: 'Disable comments',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  commentsDisabled?: boolean;

  @ApiProperty({
    description: 'Hide like count',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  likesHidden?: boolean;

  @ApiProperty({
    description: 'Archive post',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;
}
