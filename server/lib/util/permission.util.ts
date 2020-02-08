import { Request } from 'express';
import { isAuthenticatedRequest } from '../controllers/AuthenticatedRequest';
import { Permission } from '@shared/models/permission.model';

export class PermissionUtil {
    static hasPermission(req: Request, permission: Permission): boolean {
        if (!isAuthenticatedRequest(req)) {
            return false;
        }
        return req.user.permissions.includes(permission);
    }
}
