import { useState, useEffect } from "react";
import { Button, Container, FormControl, Table, Image } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const MAX_FILE_SIZE_MB = 10;

const Update = () => {
    let { id } = useParams();
    let location = useLocation();
    let userInfo = location.state.userInfo;

    let [inputs, setInputs] = useState({
        name: '',
        content: '',
        address: '',
        startEntry: '',
        endEntry: '',
        roomNumber: '',
        roomType: '',
        roomMember: '',
        price: '',
        shortContent: ''
    });
    let [files, setFiles] = useState([]);
    let [imageUrls, setImageUrls] = useState([]);
    let [thumbnail, setThumbnail] = useState(null);
    let [error, setError] = useState(null);

    let navigate = useNavigate();

    let roomTypes = [
        { value: 1, label: '스탠다드' },
        { value: 2, label: '슈페리어' },
        { value: 3, label: '디럭스' },
        { value: 4, label: '이그제큐티브' }
    ];

    let roomMembers = [
        { value: 1, label: '싱글룸' },
        { value: 2, label: '더블룸' },
        { value: 3, label: '트윈룸' },
        { value: 4, label: '트리플룸' },
        { value: 5, label: '스위트룸' }
    ];

    useEffect(() => {
        const getUpdate = async () => {
            try {
                const resp = await axios.get(`http://localhost:8080/hotel/showOne/${id}`, {
                    withCredentials: true
                });

                if (resp.status === 200) {
                    const data = resp.data;
                    const hotelDTO = data.hotelDTO || {};

                    const formatDate = (dateString) => {
                        if (!dateString) return '';
                        const date = new Date(dateString);
                        return date.toISOString().split('T')[0];
                    };

                    setInputs({
                        name: hotelDTO.name || '',
                        content: hotelDTO.content || '',
                        address: hotelDTO.address || '',
                        startEntry: formatDate(data.startDate || ''),
                        endEntry: formatDate(data.endDate || ''),
                        roomNumber: hotelDTO.roomNumber || '',
                        roomType: hotelDTO.roomType || '',
                        roomMember: hotelDTO.roomMember || '',
                        price: hotelDTO.price || '',
                        shortContent: hotelDTO.shortContent || ''
                    });

                    setImageUrls(data.imagePaths || []);
                    setThumbnail(data.thumbnail || null);
                }
            } catch (error) {
                console.error('정보를 가져오는 중 오류 발생:', error);
            }
        };

        getUpdate();
    }, [id]);

    let onChange = (e) => {
        let { name, value } = e.target;
        setInputs({
            ...inputs,
            [name]: value
        });
    };

    let onFileChange = (e) => {
        let selectedFiles = Array.from(e.target.files);

        const validFiles = selectedFiles.filter(file =>
            file.size <= MAX_FILE_SIZE_MB * 1024 * 1024
        );

        setFiles(validFiles);

        const urls = validFiles.map(file => URL.createObjectURL(file));
        setImageUrls(urls);

        if (urls.length > 0) {
            const randomIndex = Math.floor(Math.random() * urls.length);
            setThumbnail(urls[randomIndex]);
        }
    };

    let uploadFiles = async (files) => {
        try {
            const formData = new FormData();
            formData.append('id', id);
            formData.append('roomNumber', inputs.roomNumber);

            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i]);
            }

            let resp = await axios.post('http://localhost:8080/hotel/uploads', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            return resp.data.urls;
        } catch (error) {
            console.error('파일 업로드 중 오류 발생:', error);
            return [];
        }
    };

    let validateForm = () => {
        const requiredFields = [
            'name', 'content', 'address', 'startEntry', 'endEntry',
            'roomNumber', 'roomType', 'roomMember', 'price', 'shortContent'
        ];

        for (let field of requiredFields) {
            if (!inputs[field]) {
                return `모든 필드를 채워야 합니다. (${field})`;
            }
        }

        const startEntryDate = new Date(inputs.startEntry);
        const endEntryDate = new Date(inputs.endEntry);

        if (startEntryDate > endEntryDate) {
            return '시작 날짜가 종료 날짜보다 나중일 수 없습니다.';
        }

        return null;
    };

    let onSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError(null);

        try {
            const fileUrls = await uploadFiles(files);

            const hotelDTO = {
                ...inputs,
                imagePaths: fileUrls.length > 0 ? fileUrls : imageUrls,
                thumbnail: fileUrls.length > 0 ? fileUrls[Math.floor(Math.random() * fileUrls.length)] : thumbnail
            };

            let resp = await axios.post(`http://localhost:8080/hotel/update`, { ...hotelDTO, id }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (resp.status === 200) {
                navigate(`/hotel/showOne/${resp.data.destId}`, { state: { userInfo: userInfo } });
            }
        } catch (error) {
            console.error('데이터 제출 중 오류 발생:', error);
        }
    };

    useEffect(() => {
        if (error) {
            window.scrollTo(0, 0);
        }
    }, [error]);

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
        <Container className={"mt-3"}>
            <form onSubmit={onSubmit}>
                {error && <div className="alert alert-danger">{error}</div>}
                <Table striped hover bordered>
                    <thead>
                    <tr>
                        <td colSpan={2} className="text-center">{id}번 글 수정하기</td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>호텔 명</td>
                        <td>
                            <FormControl
                                type="text"
                                name="name"
                                value={inputs.name}
                                onChange={onChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>가격</td>
                        <td>
                            <FormControl
                                type="number"
                                name="price"
                                value={inputs.price}
                                onChange={onChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            요약 설명
                            <p style={{fontSize: '13px'}}>썸네일에 보여지게 됩니다!</p>
                        </td>
                        <td>
                            <FormControl
                                type={'text'}
                                value={inputs.shortContent}
                                name={'shortContent'}
                                onChange={onChange}/>
                        </td>
                    </tr>
                    <tr>
                        <td>상세설명</td>
                        <td>
                                <textarea
                                    name={'content'}
                                    value={inputs.content}
                                    className={"form-control"}
                                    onChange={onChange}/>
                        </td>
                    </tr>
                    <tr>
                        <td>주소</td>
                        <td>
                            <FormControl
                                type={'text'}
                                value={inputs.address}
                                name={'address'}
                                onChange={onChange}/>
                        </td>
                    </tr>
                    <tr>
                        <td>시작 날짜</td>
                        <td>
                            <FormControl
                                type={'date'}
                                value={inputs.startEntry}
                                name={'startEntry'}
                                onChange={onChange}/>
                        </td>
                    </tr>
                    <tr>
                        <td>종료 날짜</td>
                        <td>
                            <FormControl
                                type={'date'}
                                value={inputs.endEntry}
                                name={'endEntry'}
                                onChange={onChange}/>
                        </td>
                    </tr>
                    <tr>
                        <td>방 호수</td>
                        <td>
                            <FormControl
                                type={'number'}
                                value={inputs.roomNumber}
                                name={'roomNumber'}
                                onChange={onChange}/>
                        </td>
                    </tr>
                    <tr>
                        <td>방 타입</td>
                        <td>
                            <FormControl
                                as="select"
                                value={inputs.roomType}
                                name={'roomType'}
                                onChange={onChange}>
                                {roomTypes.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </FormControl>
                        </td>
                    </tr>
                    <tr>
                        <td>방 인원</td>
                        <td>
                            <FormControl
                                as="select"
                                value={inputs.roomMember}
                                name={'roomMember'}
                                onChange={onChange}>
                                {roomMembers.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </FormControl>
                        </td>
                    </tr>
                    <tr>
                        <td>파일 업로드</td>
                        <td>
                            <input
                                type="file"
                                name="file"
                                multiple
                                onChange={onFileChange}/>
                        </td>
                    </tr>
                    {imageUrls.length > 0 && (
                        <tr>
                            <td colSpan={2}>
                                <div className="d-flex flex-wrap">
                                    {imageUrls.map((url, index) => (
                                        <Image
                                            key={index}
                                            src={url}
                                            thumbnail
                                            style={{marginRight: '10px', marginBottom: '10px'}}
                                        />
                                    ))}
                                </div>
                            </td>
                        </tr>
                    )}
                    <tr>
                        <td colSpan={2} className={'text-center'}>
                            <div className="d-flex justify-content-center">
                                <Button
                                    type={'submit'}
                                    className="me-2"
                                    style={btnStyle}
                                >
                                    작성하기
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => navigate(-1)}
                                    style={btnStyle}
                                >
                                    뒤로가기
                                </Button>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </Table>
            </form>
        </Container>
    );
};

export default Update;
