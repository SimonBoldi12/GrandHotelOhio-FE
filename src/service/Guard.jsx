
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated, isAdmin } from "./ApiService";


export const ProtectedRoute = ({element}) => {
    const location = useLocation()
    
    return isAuthenticated() ? (
        element
    ):(
        <Navigate to={"/login"} replace state={{from: location}}/>
    )
}


export const AdminRoute = ({element}) => {
    const location = useLocation()
    
    return isAdmin() ? (
        element
    ):(
        <Navigate to={"/login"} replace state={{from: location}}/>
    )
}
