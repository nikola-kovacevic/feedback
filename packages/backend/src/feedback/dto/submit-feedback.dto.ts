import { IsString, IsInt, Min, Max, IsOptional, MaxLength, IsObject } from 'class-validator';

export class SubmitFeedbackDto {
  @IsString()
  apiKey: string;

  @IsInt()
  @Min(0)
  @Max(10)
  score: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  comment?: string;

  @IsOptional()
  @IsObject()
  userMetadata?: Record<string, unknown>;
}
