import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Table, Image } from "react-bootstrap";

const modifyDate = (dateString) => {
    let date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit'
    }).replace('.', '년 ').replace('.', '월 ').replace('.', '일');
};

const ShowOne = () => {
    const [data, setData] = useState({});
    const [images, setImages] = useState([]);
    const params = useParams();
    const id = parseInt(params.id);

    const location = useLocation();
    const userInfo = location.state.userInfo;

    const navigate = useNavigate();
    const goBack = () => {
        navigate('/', { state: { userInfo: userInfo } });
    };

    const onUpdate = () => {
        navigate('/hotel/update/' + id, { state: { userInfo: userInfo } });
    };

    const getRoomMemberText = (roomMember) => {
        switch (roomMember) {
            case 1:
                return '싱글룸';
            case 2:
                return '더블룸';
            case 3:
                return '트윈룸';
            case 4:
                return '트리플룸';
            case 5:
                return '스위트룸';
            default:
                return '알 수 없음';
        }
    };

    const getRoomTypeText = (roomType) => {
        switch (roomType) {
            case 1:
                return '스탠다드';
            case 2:
                return '슈페리어';
            case 3:
                return '디럭스';
            case 4:
                return '이그제큐티브';
            default:
                return '알 수 없음';
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const hotelResp = await axios.get(`http://localhost:8080/hotel/showOne/${id}`, {
                    withCredentials: true
                });
                if (hotelResp.status === 200) {
                    const hotelData = hotelResp.data;
                    setData({
                        ...hotelData.hotelDTO,
                        startEntry: hotelData.startDate,
                        endEntry: hotelData.endDate
                    });

                    const imagesResp = await axios.get(`http://localhost:8080/hotel/uploads/${hotelData.hotelDTO.id}/${hotelData.hotelDTO.roomNumber}`, {
                        withCredentials: true
                    });
                    if (imagesResp.status === 200) {
                        setImages(imagesResp.data);
                    }
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchData();
    }, [id]);

    const onLogout = async () => {
        const response = await axios.post('http://localhost:8080/user/logOut', {}, {
            withCredentials: true
        });

        if (response.status === 200) {
            navigate('/');
        }
    };

    const onDelete = async () => {
        const response = await axios.get(`http://localhost:8080/hotel/delete/${id}`, {
            withCredentials: true
        });

        if (response.status === 200) {
            navigate('/1', { state: { userInfo: userInfo } });
        }
    };

    const isAdmin = userInfo.role === 'role_admin';

    return (
        <Container className="mt-3">
            <Table striped bordered hover>
                <thead>
                <tr>
                    <td colSpan={2} className="text-end">
                        <Button onClick={onLogout}>로그아웃</Button>
                    </td>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td colSpan={2}>호텔명: {data.name}</td>
                </tr>
                <tr>
                    <td colSpan={2}>글번호: {data.id}</td>
                </tr>
                <tr>
                    <td colSpan={2}>작성자: {data.nickname}</td>
                </tr>
                <tr>
                    <td colSpan={2}>주소: {data.address}</td>
                </tr>
                <tr>
                    <td colSpan={2}>시작 일자: {modifyDate(data.startEntry)}</td>
                </tr>
                <tr>
                    <td colSpan={2}>종료 일자: {modifyDate(data.endEntry)}</td>
                </tr>
                <tr>
                    <td colSpan={2}>방 넘버: {data.roomNumber}</td>
                </tr>
                <tr>
                    <td colSpan={2}>방 종류: {getRoomMemberText(data.roomMember)}</td>
                </tr>
                <tr>
                    <td colSpan={2}>룸 타입: {getRoomTypeText(data.roomType)}</td>
                </tr>
                <tr>
                    <td colSpan={2}>가격: {data.price}</td>
                </tr>
                <tr>
                    <td colSpan={2}>내용</td>
                </tr>
                <tr>
                    <td colSpan={2}>{data.content}</td>
                </tr>
                {images.length > 0 && (
                    <tr>
                        <td colSpan={2} className="text-center">
                            {images.map((filename) => (
                                <Image
                                    key={filename}
                                    src={`http://localhost:8080/hotel/uploads/${data.id}/${data.roomNumber}/${filename}`}
                                    alt={`호텔 이미지 ${filename}`}
                                    fluid
                                    className="mb-2"
                                />
                            ))}
                        </td>
                    </tr>
                )}
                {isAdmin && (
                    <tr>
                        <td>
                            <Button onClick={onDelete}>삭제하기</Button>
                        </td>
                    </tr>
                )}
                {data.sellerId === userInfo.id && !isAdmin && (
                    <tr>
                        <td>
                            <Button onClick={onUpdate}>수정하기</Button>
                        </td>
                        <td>
                            <Button onClick={onDelete}>삭제하기</Button>
                        </td>
                    </tr>
                )}
                <tr>
                    <td colSpan={2} className="text-center">
                        <Button onClick={goBack}>뒤로 가기</Button>
                    </td>
                </tr>
                </tbody>
            </Table>
        </Container>
    );
};

export default ShowOne;
