import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { TimeDto } from '../time/time.dto';
export class RatingDto {
  @ApiProperty()
  clientId: string;

  @ApiProperty()
  comment: string;

  @ApiProperty()
  rating: number;
}
export class AccountDto {
  @ApiProperty()
  @IsNumber()
  accountNumber: number
  @ApiProperty()
  @IsString()
  username: string
  @ApiProperty()
  @IsString()
  bank: string
}

export class ExperienceUser {
  @ApiProperty()
  link: string;
  @ApiProperty()
  date: number;
  @ApiProperty()
  title: string;
}
export class LocationDto {
  @ApiProperty()
  @IsNumber()
  lat: number
  @ApiProperty()
  @IsNumber()
  lng: number
}

export class LawyerDto {

  @ApiProperty()
  @IsString()
  profileImg: string;

  @ApiProperty()
  @IsString()
  registerNumber: string;

  @ApiProperty()
  @IsNumber()
  experience: number;
  
  @ApiProperty()
  @IsString()
  licenseNumber: string
  
  @ApiProperty()
  @IsString()
  certificate: string
  
  @ApiProperty()
  @IsString()
  taxNumber: string

  @ApiProperty({type: AccountDto})
  account: AccountDto

  @ApiProperty({type: LocationDto}) 
  workLocation: LocationDto

  @ApiProperty({type: LocationDto}) 
  officeLocation: LocationDto

  @ApiProperty({type: LocationDto}) 
  location: LocationDto
  
  @ApiProperty({type: ExperienceUser, isArray: true})
  experiences: ExperienceUser[]
  
  @ApiProperty({ type: ExperienceUser, isArray: true })
  education?: ExperienceUser[]

  @ApiProperty({ type: ExperienceUser, isArray: true })
  degree?: ExperienceUser[]

  @ApiProperty({type: TimeDto, isArray: true})
  userServices: TimeDto[]
}
