export interface NavItemProps {
    to: string;
    label: string;
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
    isActive: boolean;
}

export interface UserProfileProps {
    userId: string | null;
    role: string | null;
    name: string | null;
    logout: () => void;
}
