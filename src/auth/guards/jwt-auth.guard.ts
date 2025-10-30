import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard that checks for a valid JWT in the Authorization header.
 * Example: Authorization: Bearer <token>
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
