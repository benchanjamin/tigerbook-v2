import React from "react";

interface HeadingProps {
    title: string;
    subtitle?: string;
    center?: boolean;
}

const Heading: React.FC<HeadingProps> = ({
                                             title,
                                             subtitle,
                                             center,
                                             className
                                         }) => {
    return (
        <div className={`${className} ${center ? 'text-center' : 'text-start'}`}>
            <div className="text-2xl font-bold">
                {title}
            </div>
            <div className="font-light text-neutral-500 mt-2">
                {subtitle}
            </div>
        </div>
    );
}

Heading.defaultProps = {
    className: ''
}

export default Heading;
