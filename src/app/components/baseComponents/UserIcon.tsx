"use client";

import React from "react";

export default function UserIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
    return (
        <svg
            viewBox="0 0 32 32"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            style={style}
            aria-hidden="true"
        >
            {/* Herb crown — three leaf sprigs */}
            {/* Center leaf */}
            <path d="M16 10.5C15.1 8 15.1 5.5 16 5.5C16.9 5.5 16.9 8 16 10.5Z" />
            {/* Left leaf — angled outward */}
            <path d="M14.2 11.2C11.8 9.4 11 6.8 12.6 6.2C14.2 5.6 14.5 9 14.2 11.2Z" />
            {/* Right leaf — angled outward */}
            <path d="M17.8 11.2C20.2 9.4 21 6.8 19.4 6.2C17.8 5.6 17.5 9 17.8 11.2Z" />

            {/* Head */}
            <circle cx="16" cy="17" r="5.5" />

            {/* Shoulders */}
            <path d="M3.5 30C3.5 24 9.5 22 16 22C22.5 22 28.5 24 28.5 30Z" />
        </svg>
    );
}
