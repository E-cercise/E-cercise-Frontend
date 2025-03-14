import React from "react";

const AllProductIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    return (
        <svg
            width="16"
            height="15"
            viewBox="0 0 16 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            stroke="currentColor"
            {...props}
        >
            <path d="M13.0978 5.38428H2.90219C2.40392 5.38428 2 5.73642 2 6.1708V11.5721C2 12.0065 2.40392 12.3586 2.90219 12.3586H13.0978C13.5961 12.3586 14 12.0065 14 11.5721V6.1708C14 5.73642 13.5961 5.38428 13.0978 5.38428Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linejoin="round"
                  fill="none"
            />
            <path d="M4.5 2.76904H11.5H4.5ZM3.5 4.07674H12.5H3.5Z"
                  fill="currentColor"/>
            <path d="M4.5 2.76904H11.5M3.5 4.07674H12.5"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-miterlimit="10"
                  stroke-linecap="round"/>
        </svg>
    );
};

export default AllProductIcon;