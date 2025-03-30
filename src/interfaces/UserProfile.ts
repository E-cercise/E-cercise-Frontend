export interface UserProfile {
    email: string;
    first_name: string;
    last_name: string;
    address: string;
    phone_number: string;
    age: number;
    height: number;
    weight: number;
    gender: string;
    experience: string;
    goal_id: string;
    preferences: string[];
}


export interface UserGoal { id: string; name: string }
export interface UserTag { id: string; name: string }

