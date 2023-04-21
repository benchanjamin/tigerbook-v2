import React from "react";

interface ContainerProps {
    children: React.ReactNode
}

const Container: React.FC<ContainerProps> = ({ children, className }) => {
    return (
        <div
            className={`
        max-w-[2520px]
        mx-auto
        ${className}
      `}
        >
            {children}
        </div>
    );
}

export default Container;
