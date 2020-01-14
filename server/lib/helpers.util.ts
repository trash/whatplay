import moment from 'moment';
export function getCurrentUtcTime() {
    return moment().toISOString();
}
