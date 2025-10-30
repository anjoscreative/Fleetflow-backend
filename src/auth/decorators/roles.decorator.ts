import { SetMetadata } from '@nestjs/common';

/**
 * Marks a route with allowed roles.
 * Example: @Roles('admin')
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
