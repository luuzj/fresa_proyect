import { IsNotEmpty, IsString } from "class-validator";

export class RegisterUserDto {
@IsString()
@IsNotEmpty()
name!: string;
email!: string;
password!: string;
}
