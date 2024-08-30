// Logout.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        let message = () => window.alert('로그아웃 합니다..');
        const logout = async () => {
            message()
            try {
                await axios.post('http://localhost:8080/user/logOutSuccess', {}, { withCredentials: true });
                // 로그아웃 성공 후 main 페이지로 리디렉션
                navigate('/');
            } catch (error) {
                console.error("Logout error", error);
            }
        };

        logout();
    }, [navigate]);




    return (
        <div>로그아웃 중...</div>
    );
};

export default Logout;
