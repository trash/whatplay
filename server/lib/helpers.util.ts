import moment from 'moment';
import { AuthenticatedRequest } from './controllers/AuthenticatedRequest';

export function getCurrentUtcTime() {
    return moment().toISOString();
}

export function getAuth0UserIdFromRequest(req: AuthenticatedRequest): string {
    return req.user.sub;
}
