export interface NavItemProps {
    to: string;
    label: string;
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
    isActive: boolean;
}