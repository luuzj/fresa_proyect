import { RegisterUserDto } from './dto/register.dto';
import { Injectable, NotFoundException, ConflictException} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(user: RegisterUserDto) {
    const exit = await this.userRepository.findOne({ where: { email: user.email } });
    if (exit) {
      throw new ConflictException(`El correo ya está registrado`);
    }
    const hashed = await bcrypt.hash(user.password, 10);
    const newUser = this.userRepository.create({ ...user, password: hashed }); 
    return await this.userRepository.save(newUser);
  }

async findByEmail(email: string){
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }


















  async findAll() {
    const users = await this.userRepository.find();
    return users;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    const updatedUser = this.userRepository.merge(user, updateUserDto);

    return await this.userRepository.save(updatedUser);
  }

  async remove(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    await this.userRepository.delete(id);

    return {
      message: `Usuario con id ${id} eliminado correctamente`,
    };
  }
}