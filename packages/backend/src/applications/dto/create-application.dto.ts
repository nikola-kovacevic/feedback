import {
  IsString, MaxLength, IsBoolean, IsIn, IsInt, Min, Max,
  IsOptional, ValidateNested, IsHexColor,
} from 'class-validator';
import { Type } from 'class-transformer';

export class WidgetConfigDto {
  @IsIn(['floating', 'inline'])
  mode: 'floating' | 'inline';

  @IsString()
  @MaxLength(500)
  question: string;

  @IsBoolean()
  commentRequired: boolean;

  @IsHexColor()
  themeColor: string;

  @IsInt()
  @Min(0)
  @Max(8760)
  cooldownHours: number;

  @IsIn(['bottom-right', 'bottom-left', 'top-right', 'top-left'])
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export class AlertConfigDto {
  @IsBoolean()
  enabled: boolean;

  @IsString()
  slackUrl: string;

  @IsInt()
  @Min(0)
  @Max(100)
  npsThreshold: number;
}

export class CreateApplicationDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  appUrl?: string;

  @IsOptional()
  @IsString()
  icon?: string; // base64-encoded image, max ~500KB

  @ValidateNested()
  @Type(() => WidgetConfigDto)
  widgetConfig: WidgetConfigDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => AlertConfigDto)
  alertConfig?: AlertConfigDto;
}
