export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Athlete' | 'Elderly';
export type Gender = 'Male' | 'Female';

export interface RegisterPayload {
    email: string;
    password: string;
    confirm_password?: string; // optional because we omit it before sending
    first_name: string;
    last_name: string;
    address: string;
    phone_number: string;
    weight: number;
    height: number;
    experience: ExperienceLevel;
    goal_id: string;
    preferences: string[]; // array of tag IDs (UUIDs)
    gender: Gender;
    Age: number;
}
