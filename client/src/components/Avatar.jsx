import React from "react";
import { generateAvatar } from "../utils/generateAvatar";

function Avatar({ user, size = 64 }) {
    // Use the same property names as in Navbar/backend
    const avatarSrc =
        user.profileImageURL && user.profileImageURL.trim() !== ""
            ? user.profileImageURL
            : generateAvatar(user.fullName, size); // use fullName

    return (
        <img
            src={avatarSrc}
            alt={user.fullName}
            width={size}
            height={size}
            className="rounded-full border border-gray-300 object-cover"
        />
    );
}

export default Avatar;
