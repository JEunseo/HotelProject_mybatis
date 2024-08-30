import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BasketByUser from "../basket/BasketByUser";

const AdminshowUserOne = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`http://localhost:8080/user/${id}`);
                if (!response.ok) {
                    throw new Error('네트워크 응답이 올바르지 않습니다.');
                }
                const data = await response.json();
                setUser(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p>오류: {error}</p>;

    return (
        <div>
            <h1>관리자 페이지</h1>
            <p>여기서 관리 작업을 수행할 수 있습니다.</p>
            {user ? (
                <div>
                    <h2>사용자 정보</h2>
                    <p>이름: {user.username}</p>
                    <p>역할: {user.role}</p>
                </div>
            ) : (
                <p>사용자 정보를 찾을 수 없습니다.</p>
            )}
            console.log("사용자id:",{user.id})
            <BasketByUser userid={user.id}/>
        </div>
    );
}

export default AdminshowUserOne;
