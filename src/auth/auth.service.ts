import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { User } from 'src/entities/user.entity';
import { use } from 'passport';
import { access } from 'fs';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly jwtService: JwtService,
    ){}

    //to register a new user
    async register(data: { email: string; password: string; fullName: string; role?: string }){
        const existing = await this.userRepo.findOne({ where: { email: data.email } });
        if (existing) throw new ConflictException('Email already in use');

        const passwordHash = await argon2.hash(data.password);

        const user = this.userRepo.create({
            email: data.email,
            passwordHash,
            fullName: data.fullName,
            role: (data.role as any) || 'customer',
        });

        await this.userRepo.save(user);
        return this.signToken(user)
    }

    //Login existing user
    async login(data: { email: string; password: string }) {
        const user = await this.userRepo.findOne({ where: { email: data.email } });
        if(!user) throw new UnauthorizedException('Invalid credentials');

        const valid = await argon2.verify(user.passwordHash, data.password);
        if(!valid) throw new UnauthorizedException('Invalid credentials');

        return this.signToken(user);
    }

    private signToken(user: User) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        const token = this.jwtService.sign(payload);
        return { acces_token: token };
    }
}
