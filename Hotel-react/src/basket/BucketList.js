import React, { useEffect, useState } from 'react';
import { Link, useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Table, Spinner, Alert, Button } from 'react-bootstrap';

let BucketList = (props) => {
    const { userid: paramUserId } = useParams();
    const userid = props.userid || paramUserId;
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    let [buckets, setBuckets] = useState([]);
    let [loading, setLoading] = useState(true);
    let [error, setError] = useState(null);
    let handelGoBack=()=>{
        window.history.back();
    };
    useEffect(() => {
        let fetchBuckets = async () => {
            try {
                let userResponse = await axios.get(`http://localhost:8080/user/${userid}`);
                setUser(userResponse.data); // 사용자 정보 상태 업데이트

                let response = await axios.get(`http://localhost:8080/user/basket/${userid}`);//주소 수정 1
                setBuckets(response.data); // 서버에서 가져온 데이터로 buckets 상태 업데이트
            } catch (error) {
                setError('Failed to fetch data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchBuckets(); // 컴포넌트가 마운트될 때 데이터를 가져옴
    }, [userid]);

    let deleteBucket = async (bucketId) => {
        try {
            await axios.delete(`http://localhost:8080/user/basket/${bucketId}`);//주소 수정 2
            setBuckets(buckets.filter(bucket => bucket.id !== bucketId));
            alert('삭제가 완료되었습니다.');
        } catch (error) {
            setError('Failed to delete item. Please try again later.');
        }
    };

    console.log(buckets)

    const bookHotel = async (bucketId,hotelId) => {

        try {
            const response = await axios.post(
                `http://localhost:8080/user/book`,
                { id: bucketId, hotelId: hotelId},
                { withCredentials: true }
            );
            if (response.status === 200) {
                alert('예약되었습니다.');
            }
            setBuckets(prevBuckets =>
                prevBuckets.map(bucket =>
                    bucket.id === hotelId ? { ...bucket, booked: true } : bucket
                )
            );
            navigate(0);
        } catch (error) {
            setError('예약에 실패했습니다. 나중에 다시 시도해 주세요.');
        }
    };

    const btnStyle = {
        padding: '6px 12px',
        backgroundColor: '#439798',
        color: 'white',
        border: '1px solid white',
        borderRadius: '5px',
        fontSize: '14px',
        textDecoration: 'none',
    }


    return (
        <Container className="mt-4">
            <h4 className="mb-4"> {user ? `${user.username}의 장바구니` : '장바구니'} </h4>
            {loading ? (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" />
                </div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <Table striped bordered hover responsive variant="light">
                    <thead>
                    <tr>
                        <th>호텔 이름</th>
                        <th>가격 </th>
                        <th> </th>
                    </tr>
                    </thead>
                    <tbody>
                    {buckets.length > 0 ? (
                        buckets.map(bucket => (
                            <tr key={bucket.id}>
                                <td>{bucket.hotelName}</td>
                                <td>${bucket.price.toFixed(2)}</td>
                                <td>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => deleteBucket(bucket.id)}
                                    >
                                        삭제
                                    </Button>

                                    {!bucket.booked && (
                                        <Button
                                            onClick={() => bookHotel(bucket.id, bucket.hotelId)}
                                            className="ms-2"
                                            style={btnStyle}
                                        >
                                            예약
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">No data available</td>
                        </tr>
                    )}
                    </tbody>
                </Table>
            )}
            <Button
                onClick={handelGoBack}
                style={btnStyle}
            >
                뒤로가기</Button>
        </Container>

    );
};

export default BucketList;
