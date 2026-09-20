import { EventItem } from '../types';

// Empty by default — events are published by administrators via the admin dashboard.
// Backend integration will populate this array from the database.
export const mockEvents: EventItem[] = [];
