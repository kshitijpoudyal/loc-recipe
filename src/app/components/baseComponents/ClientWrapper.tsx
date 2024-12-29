"use client";

import React, {useEffect} from "react";

interface ClientWrapperProps {
    children: React.ReactNode;
}

const ClientWrapper: React.FC<ClientWrapperProps> = ({children}) => {
    useEffect(() => {

    }, []);
    return (
        <div>{children}</div>
    )
}

export default ClientWrapper