import React from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import authService from '../../services/auth';
import { logout as storeLogout } from '../../store/authSlice';

function LogoutBtn() {
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const logouthandler = () => {
        authService.logout()
        .then(() => dispatch(storeLogout()))
        .then(() => navigate("/"))
    }

    return (
        <button className='inline-block px-6 py-2 text-white font-medium duration-200 hover:bg-blue-100 rounded-full' onClick={logouthandler}>
            Logout
        </button>
    );
}

export default LogoutBtn;