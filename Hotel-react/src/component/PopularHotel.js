import React, { useEffect, useState, forwardRef } from 'react';
import axios from 'axios';
import {Card, Container} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const PopularHotel = forwardRef(({ max }, ref) => {
    const [hotels, setHotels] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await axios.get('http://localhost:8080/hotel/showList/1', { withCredentials: true });
                if (response.status === 200) {
                    const hotelList = response.data.hotelList;


                    // Fetch images and ratings for hotels
                    const hotelsWithDetails = await Promise.all(hotelList.map(async (hotel) => {
                        try {
                            // Fetch images
                            const imagesResp = await axios.get(`http://localhost:8080/hotel/uploads/${hotel.id}/${hotel.roomNumber}`, { withCredentials: true });
                            const images = imagesResp.status === 200 ? imagesResp.data : [];

                            // Fetch ratings
                            const ratingResponse = await axios.get(`http://localhost:8080/reply/selectList/${hotel.id}`);
                            const { totalScore, totalCount } = ratingResponse.data;
                            const averageRating = totalCount > 0 ? totalScore / totalCount : 0;

                            return {
                                ...hotel,
                                images,
                                averageRating
                            };
                        } catch (error) {
                            console.error('Error fetching hotel details:', hotel.id, error);
                            return {
                                ...hotel,
                                images: [],
                                averageRating: 0
                            };
                        }
                    }));

                    const sortedHotels = hotelsWithDetails.sort((a, b) => b.averageRating - a.averageRating);
                    setHotels(sortedHotels.slice(0, max));
                }
            } catch (error) {
                console.error('Error fetching hotels:', error);
            }
        };

        fetchHotels();
    }, [max]);

    return (
        <Container fluid style={{ marginTop: '40px', cursor: 'pointer' }}>
            {hotels.length > 0 ? (
                hotels.map(hotel => {

                    const images = hotel.images || [];
                    const firstImage = images.length > 0 ? images[0] : null;

                    const thumbnailUrl = firstImage
                        ? `http://localhost:8080/hotel/uploads/${hotel.id}/${hotel.roomNumber}/${firstImage}`
                        : 'http://localhost:8080/hotel/main/placeholder.jpg';


                    return (
                        <Link
                            key={hotel.id}
                            to={`/hotel/showOne/${hotel.id}`}
                            style={{ display: 'inline-block', textDecoration: 'none' }}
                            onClick={() => navigate(`/hotel/showOne/${hotel.id}`)}
                        >
                            <Card style={{ width: '300px', height: 'auto', margin: '10px 5px 10px' }}>
                                <Card.Img
                                    variant="top"
                                    src={thumbnailUrl}
                                    style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                    alt={`Image of ${hotel.name}`}
                                />
                                <Card.Body>
                                    <Card.Text className={'d-flex justify-content-between'}>
                                        <span style={{width:'70%'}}>{hotel.shortContent}</span>
                                        <span style={{width: '25%'}}>평점: {hotel.averageRating.toFixed(1)}</span>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Link>
                    );
                })
            ) : (
                <div className="text-center">인기 호텔이 없습니다.</div>
            )}
        </Container>
    );
});

export default PopularHotel;
