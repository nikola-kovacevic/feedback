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

export class CreateApplicationDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ValidateNested()
  @Type(() => WidgetConfigDto)
  widgetConfig: WidgetConfigDto;
}
