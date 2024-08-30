import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Table, Button } from 'react-bootstrap';

const MyBasket = () => {
    const { userid } = useParams();
    const [basketItems, setBasketItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 백엔드에서 장바구니 데이터를 가져옵니다.
        const fetchBasketItems = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/user/basket/${userid}`, {
                    withCredentials: true,
                });
                if (response.status === 200) {
                    setBasketItems(response.data);
                }
            } catch (e) {
                setError('장바구니 데이터를 가져오지 못했습니다.');
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchBasketItems();
    }, [userid]);

    // 총 가격 계산 함수
    const calculateTotalPrice = () => {
        return basketItems.reduce((total, item) => total + item.price, 0);
    };

    // 장바구니에서 상품을 제거하는 함수
    const handleRemoveItem = async (productId) => {
        console.log()
        try {

            const response = await axios.delete(`http://localhost:8080/user/basket/${userid}/${productId}`, {
                withCredentials: true,
            });
            if (response.status === 204) {
                // 성공적으로 삭제된 경우 상태를 업데이트하여 UI를 갱신합니다.
                setBasketItems((prevItems) =>
                    prevItems.filter((item) => item.productId !== productId)
                );
            }
        } catch (e) {
            console.error('상품 삭제 중 오류가 발생했습니다.', e);
            alert('상품 삭제에 실패했습니다.');
        }
    };

    if (loading) {
        return <p>로딩 중...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <Container className="mt-3">
            <h2>장바구니</h2>
            {basketItems.length === 0 ? (
                <p>장바구니에 상품이 없습니다.</p>
            ) : (
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>번호</th>
                        <th>호텔</th>
                        <th>방 호수</th>
                        <th>가격</th>
                        <th>삭제</th>
                    </tr>
                    </thead>
                    <tbody>
                    {basketItems.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.roomNumber}</td>
                            <td>{item.price}</td>
                            <td>
                                <Button
                                    variant="danger"
                                    onClick={() => handleRemoveItem(item.id)}
                                >
                                    삭제
                                </Button>
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan="4" className="text-end"><strong>총 가격:</strong></td>
                        <td><strong>{calculateTotalPrice()} 원</strong></td>
                    </tr>
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default MyBasket;
