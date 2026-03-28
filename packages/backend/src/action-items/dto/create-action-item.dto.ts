import { IsString, IsUUID, IsOptional, MaxLength } from 'class-validator';

export class CreateActionItemDto {
  @IsUUID()
  applicationId: string;

  @IsString()
  @MaxLength(500)
  text: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  tag?: string;
}
