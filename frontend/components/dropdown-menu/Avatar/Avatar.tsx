import Image from "next/image";
import styles from "./Avatar.module.css";
import React from "react";

interface AvatarProps {
    profilePicSrc: string | null | undefined;
}

const Avatar: React.FC<AvatarProps> = ({profilePicSrc}) => {
    return (
        <div className={`${styles.avatar} relative h-[30px] w-[30px] block`}
        >
            <Image
                fill
                style={{borderRadius: '50%', objectFit: 'cover'}}
                alt="Avatar"
                src={profilePicSrc || '/placeholder.jpg'}
            />
        </div>
    );
}

export default Avatar;
