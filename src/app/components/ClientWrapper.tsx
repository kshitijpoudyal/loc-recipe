"use client";

import React from "react";

interface ClientWrapperProps {
    children: React.ReactNode;
}

const ClientWrapper: React.FC<ClientWrapperProps> = ({children}) => {
    return (
        <div>{children}</div>
    )
}

export default ClientWrapper