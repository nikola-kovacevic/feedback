import {
  IsString, MaxLength, IsBoolean, IsIn, IsInt, Min, Max,
  IsOptional, ValidateNested, IsHexColor, Matches,
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
  @Matches(/^https:\/\/hooks\.slack\.com\/services\//, {
    message: 'slackUrl must be a valid Slack webhook URL (https://hooks.slack.com/services/...)',
  })
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
  @MaxLength(350000) // ~256KB base64-encoded
  icon?: string;

  @ValidateNested()
  @Type(() => WidgetConfigDto)
  widgetConfig: WidgetConfigDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => AlertConfigDto)
  alertConfig?: AlertConfigDto;
}
