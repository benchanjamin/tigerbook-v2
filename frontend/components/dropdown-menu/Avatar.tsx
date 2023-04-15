import Image from "next/image";

interface AvatarProps {
    profilePicSrc: string | null | undefined;
}

const Avatar: React.FC<AvatarProps> = ({ profilePicSrc }) => {
    return (
        <Image
            className="rounded-full"
            height="30"
            width="30"
            alt="Avatar"
            src={profilePicSrc || '/placeholder.jpg'}
        />
    );
}

export default Avatar;
