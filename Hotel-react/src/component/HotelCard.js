import {Button, Card} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import axios from "axios";

const HotelCard = ({hotel, userInfo}) => {

    const btnStyle = {
        padding: '8px 5px',
        backgroundColor: '#439798',
        color: 'white',
        border: '1px solid white',
        borderRadius: '5px',
        fontSize: '14px',
        width: '100%'
    }



    // 이미지 URL 설정: 호텔 이미지가 있을 경우 랜덤 이미지 선택, 없으면 기본 이미지 사용
    const thumbnailUrl = hotel.images && hotel.images.length > 0
        ? `http://localhost:8080/hotel/uploads/${hotel.id}/${hotel.roomNumber}/${hotel.images[Math.floor(Math.random() * hotel.images.length)]}`
        : 'placeholder.jpg'; // 기본 이미지 URL 또는 로컬 파일

    // 평점 추가
    const [average, setAverage] = useState(0)
    useEffect(() => {
        const averageScore = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/reply/selectList/${hotel.id}`);
                if (response.status === 200) {
                    const { totalScore, totalCount } = response.data;
                    if (totalCount > 0) {
                        setAverage(totalScore / totalCount);
                    }
                }
            } catch (error) {
                console.error('Error fetching total score and count:', error);
            }
        };

        averageScore();
    }, [hotel.id]);

    return (
        <div style={{width: '280px', display: 'inline-block', margin: '2%'}}>
            <Card style={{width: '18rem'}}>
                <Card.Img variant="top" src={thumbnailUrl}
                          style={{width: 'inherit', height: '180px', objectFit: 'cover'}}/>
                <Card.Body>
                    <Card.Title>{hotel.name}</Card.Title>
                    <Card.Text style={{textAlign: "right"}}>
                        <p>{hotel.shortContent}</p>
                        <p>평점: {average.toFixed(1)}</p>
                    </Card.Text>
                    <Link to={`/hotel/showOne/${hotel.id}`} state={{userInfo: userInfo}}>
                        <Button variant="primary" style={btnStyle}>
                            자세히 보기
                        </Button>
                    </Link>
                </Card.Body>
            </Card>
        </div>
    );
}

export default HotelCard;
