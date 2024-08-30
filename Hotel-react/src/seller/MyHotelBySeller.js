import React, {useState, useEffect} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {Button} from "react-bootstrap";

const MyHotelBySeller = () => {
    const {sellerid} = useParams(); // URL에서 sellerid 추출
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [activeTab, setActiveTab] = useState('booked');
    const bookedHotels = hotels.filter(hotel => hotel.booked);
    const unbookedHotels = hotels.filter(hotel => !hotel.booked);

    let navigate = useNavigate()
    let onNavigate = () => {
        navigate("/");
    }

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await fetch(`http://localhost:8080/user/myhotel/${sellerid}`);
                if (!response.ok) {
                    throw new Error('네트워크 응답이 올바르지 않습니다.');
                }
                const data = await response.json();
                setHotels(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchHotels();
    }, [sellerid]);

    if (loading) return <p style={{textAlign: 'center', fontSize: '18px'}}>로딩 중...</p>;
    if (error) return <p style={{textAlign: 'center', color: 'red', fontSize: '18px'}}>오류: {error}</p>;
    const handleCancel = async (hotelId) => {
        try {
            const response = await fetch(`http://localhost:8080/hotel/delete/${hotelId}`, {
                method: 'DELETE'
            });
            if (response.status === 200) {
                const message = await response.text();
                alert(message);
                // 삭제 성공 후, 해당 호텔을 목록에서 제거
                setHotels(hotels.filter(hotel => hotel.id !== hotelId));
            } else {
                const message = await response.text();
                alert(message);
            }

        } catch (error) {
            console.error('호텔 삭제 중 오류 발생:', error);
            alert('호텔 삭제에 실패했습니다. 나중에 다시 시도해 주세요.');
        }
    };
    return (
        <div style={{padding: '20px', maxWidth: '900px', margin: '0 auto'}}>
            <h1 style={{textAlign: 'center', marginBottom: '20px'}}>호텔 관리</h1>

            <div style={{marginBottom: '40px', width: '100%', borderBottom: '2px solid #ddd'}}
                 className={'d-flex align-items-end justify-content-end'}>
                    <span>
                        <Button onClick={onNavigate} style={{
                            padding: '5px 10px',
                            margin: '20px auto',
                            backgroundColor: '#fff',
                            borderRadius: '5px',
                            border: '1px solid #439798',
                            color: '#439798'
                        }}>뒤로가기</Button>
                    </span>
            </div>
            {/* 탭 버튼 */}

            <div style={{display: 'flex', justifyContent: 'center', marginBottom: '20px'}}>
                <button
                    onClick={() => setActiveTab('booked')}
                    style={{
                        padding: '10px 20px',
                        marginRight: '10px',
                        backgroundColor: activeTab === 'booked' ? '#439798' : '#ddd',
                        color: activeTab === 'booked' ? 'white' : 'black',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    예약된 호텔
                </button>
                <button
                    onClick={() => setActiveTab('unbooked')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: activeTab === 'unbooked' ? '#439798' : '#ddd',
                        color: activeTab === 'unbooked' ? 'white' : 'black',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    판매 중인 호텔
                </button>
            </div>

            {/* 현재 선택된 탭에 맞는 호텔 목록 */}
            {activeTab === 'booked' ? (
                bookedHotels.length === 0 ? (
                    <p style={{textAlign: 'center', fontSize: '18px', color: '#666'}}>예약된 호텔이 없습니다.</p>
                ) : (
                    <ul style={{listStyleType: 'none', paddingLeft: 0}}>
                        {bookedHotels.map((hotel) => (
                            <li key={hotel.id} style={{
                                marginBottom: '20px',
                                padding: '15px',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                backgroundColor: '#f9f9f9'
                            }}>
                                <h2 style={{margin: '0 0 10px 0', fontSize: '18px'}}>{hotel.name}</h2>
                                <p style={{margin: '5px 0'}}><strong>예약 여부:</strong> O</p>
                                <p style={{margin: '5px 0'}}><strong>가격:</strong> {hotel.price} 원</p>
                                <p style={{margin: '5px 0'}}><strong>방 타입:</strong> {hotel.roomMember}인실</p>
                                <p style={{margin: '5px 0'}}>
                                    <Link
                                        to={`/hotel/showOne/${hotel.id}`}
                                        style={{color: '#439798', textDecoration: 'none', fontWeight: 'bold'}}
                                    >
                                        호텔 상세 페이지
                                    </Link>
                                </p>
                                <button
                                    onClick={() => handleCancel(hotel.id)}
                                    style={{
                                        padding: '10px 15px',
                                        color: 'white',
                                        backgroundColor: '#d9534f',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    호텔 삭제
                                </button>
                            </li>
                        ))}
                    </ul>
                )
            ) : (
                unbookedHotels.length === 0 ? (
                    <p style={{textAlign: 'center', fontSize: '18px', color: '#666'}}>예약되지 않은 호텔이 없습니다.</p>
                ) : (
                    <ul style={{listStyleType: 'none', paddingLeft: 0}}>
                        {unbookedHotels.map((hotel) => (
                            <li key={hotel.id} style={{
                                marginBottom: '20px',
                                padding: '15px',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                backgroundColor: '#f9f9f9'
                            }}>
                                <h2 style={{margin: '0 0 10px 0', fontSize: '18px'}}>{hotel.name}</h2>
                                <p style={{margin: '5px 0'}}><strong>예약 여부:</strong> X</p>
                                <p style={{margin: '5px 0'}}><strong>가격:</strong> {hotel.price} 원</p>
                                <p style={{margin: '5px 0'}}><strong>방 타입:</strong> {hotel.roomMember}인실</p>
                                <p style={{margin: '5px 0'}}>
                                    <Link
                                        to={`/hotel/showOne/${hotel.id}`}
                                        style={{color: '#3498db', textDecoration: 'none', fontWeight: 'bold'}}
                                    >
                                        호텔 상세 페이지
                                    </Link>
                                </p>
                                <button
                                    onClick={() => handleCancel(hotel.id)}
                                    style={{
                                        padding: '10px 15px',
                                        color: 'white',
                                        backgroundColor: '#d9534f',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    호텔 삭제
                                </button>
                            </li>
                        ))}
                    </ul>
                )
            )}
        </div>
    );
};

export default MyHotelBySeller;
