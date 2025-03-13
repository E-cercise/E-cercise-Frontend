export interface NavItemProps {
    to: string; // Destination path for the link
    label: string; // Text label for the nav item
    blackIcon: string; // Black version of the SVG icon
    whiteIcon: string; // White version of the SVG icon
    isActive: boolean; // Whether this nav item is active
}