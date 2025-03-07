import { IsOptional, IsNumber, IsDefined, IsString, IsNotEmpty, IsEmail, IsEnum } from 'class-validator';
import { IsAllowedDateFormat } from '../common/validator-helper/dateValidator';
import { LeadStatusEnum } from '../enum/status.enum';

export class LeadModel {
  @IsOptional()
  @IsNumber()
  row_id?: number;
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  name!: string;    
  @IsDefined()
  @IsNotEmpty()
  @IsEnum(LeadStatusEnum)
  status?: LeadStatusEnum;
  @IsOptional()
  @IsAllowedDateFormat()
  created_at?: Date;
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  email_address!: string;
}
