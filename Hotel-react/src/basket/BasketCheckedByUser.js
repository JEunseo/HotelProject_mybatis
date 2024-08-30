import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from "axios";
import {Button} from "react-bootstrap";

const BasketCheckedByUser = (props) => {
    const { userid: paramUserId } = useParams();
    const userid = props.userid || paramUserId;
    const handelGoBack=()=>{
        window.history.back();

    }
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await fetch(`http://localhost:8080/user/basketChecked/${userid}`);
                if (!response.ok) {
                    throw new Error('네트워크 응답이 올바르지 않습니다.');
                }
                const data = await response.json();
                setReservations(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchReservations();
    }, [userid]);

    const handleCancel = async (reservationId) => {
        try {
            //reservationId (장바구니id)
            const response = await axios.post(
                `http://localhost:8080/user/cancelReservation/${reservationId}`,
                { reservationId: reservationId },
                { withCredentials: true }
            );
            if (response.status === 200) {
                alert('예약이 취소되었습니다.');
            }
            // 성공적으로 취소한 후, 해당 예약을 목록에서 제거
            setReservations(reservations.filter(reservation => reservation.id !== reservationId));
        } catch (error) {
            alert(error.message);
        }
    };

    if (loading) return <p style={{ textAlign: 'center' }}>로딩 중...</p>;
    if (error) return <p style={{ textAlign: 'center', color: 'red' }}>오류: {error}</p>;

    const btnStyle = {
        padding: '10px 15px',
        backgroundColor: '#439798',
        color: 'white',
        border: '1px solid white',
        borderRadius: '5px',
        fontSize: '14px',
        textDecoration: 'none',
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>예약 내역</h1>
            {reservations.length === 0 ? (
                <p style={{ textAlign: 'center', fontSize: '18px', color: '#666' }}>예약 내역이 없습니다.</p>
            ) : (
                <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                    {reservations.map((reservation) => (
                        <li key={reservation.id} style={{
                            marginBottom: '20px',
                            padding: '15px',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            backgroundColor: '#f9f9f9'
                        }}>
                            <h2 style={{margin: '0 0 10px 0', fontSize: '18px'}}>호텔 : {reservation.hotelName}</h2>
                            <p style={{margin: '5px 0'}}>체크인 날짜: {reservation.startEntry}</p>
                            <p style={{margin: '5px 0'}}>체크아웃 날짜: {reservation.endEntry}</p>
                            <p style={{margin: '5px 0'}}>결제 금액: {reservation.price}원</p>
                            <p style={{margin: '5px 0'}}>
                                결제 여부: {reservation.payment ? "결제 완료" : "결제 대기 중"}
                            </p>
                            <p style={{margin: '5px 0'}}>
                                호텔 승인 여부: {reservation.booked ? "승인 완료" : "승인 대기 중"}
                                (hotel booked가 0이면 승인 미완료, 1이면 승인 완료입니다. 확인용 로그...^^)
                            </p>
                            <button
                                onClick={() => handleCancel(reservation.id)}//basket.id입니다.
                                style={{
                                    padding: '10px 15px',
                                    color: 'white',
                                    backgroundColor: '#d9534f',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }}
                            >
                                예약 취소
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            <Button
                onClick={handelGoBack}
                style={btnStyle}
            >
                뒤로가기
            </Button>
        </div>
    );
};

export default BasketCheckedByUser;
