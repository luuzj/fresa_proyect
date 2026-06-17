import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/entities/user.entity';
import { LoginDto } from '../../users/dto/login.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor( 
        private UsersService:UsersService,
        private JwtService:JwtService){}

        async login(user:LoginDto){
            const User = await this.UsersService.
            findByEmail(user.email);
            if(!User) throw new UnauthorizedException('Credenciales invalidas')
                const match = await bcrypt.compare(user.password, User.password)
            if(!match) throw new UnauthorizedException('Credenciales invalidas')
                const payload = { sub:User.id,email:user.email}
            return {access_token:this.JwtService.sign(payload),
                user:{id:User.id,name:User.name}
            }


            }
}
