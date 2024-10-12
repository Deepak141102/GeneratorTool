import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const PublicRoute = ({ email, children }) => {
    const navigate = useNavigate();
    useEffect(() => {
        if (email) {
            navigate('/home');
        }
    }, [email])

    console.log(children)

    return <>{children}</>;
}

export default PublicRoute