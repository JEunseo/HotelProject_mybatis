import { Container, Pagination, Table, Button, Image, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";

let ShowList = () => {
    let location = useLocation();
    let userInfo = location.state?.userInfo || {};
    let params = useParams();
    let pageNo = params.pageNo || 1;
    let [data, setData] = useState({ hotelList: [] });
    let [searchType, setSearchType] = useState('name');
    let [keyword, setKeyword] = useState('');
    let [minPrice, setMinPrice] = useState('');
    let [maxPrice, setMaxPrice] = useState('');
    let [startDate, setStartDate] = useState('');
    let [endDate, setEndDate] = useState('');
    let [isSearching, setIsSearching] = useState(false);
    let navigate = useNavigate();

    useEffect(() => {
        if (!userInfo || !userInfo.role) {
            return;
        }
    }, [userInfo]);

    let moveToSingle = (id) => {
        navigate('/hotel/showOne/' + id, { state: { userInfo: userInfo } });
    };

    let moveToPage = (pageNo) => {
        navigate(`/hotel/showList/${pageNo}?searchType=${searchType}&keyword=${keyword}&minPrice=${minPrice}&maxPrice=${maxPrice}&startDate=${startDate}&endDate=${endDate}`, { state: { userInfo: userInfo } });
    };

    useEffect(() => {
        let selectList = async () => {
            try {
                const params = {
                    searchType: searchType || undefined,
                    keyword: keyword || undefined,
                    minPrice: minPrice || undefined,
                    maxPrice: maxPrice || undefined,
                    startDate: startDate || undefined,
                    endDate: endDate || undefined
                };


                let resp = await axios.get(`http://localhost:8080/hotel/showList/${pageNo}`, {
                    params: isSearching ? Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined)) : {},
                    withCredentials: true
                });
                if (resp.status === 200) {
                    const hotelList = await Promise.all(resp.data.hotelList.map(async (hotel) => {
                        try {
                            const imagesResp = await axios.get(`http://localhost:8080/hotel/uploads/${hotel.id}/${hotel.roomNumber}`, {
                                withCredentials: true
                            });
                            return {
                                ...hotel,
                                images: imagesResp.status === 200 ? imagesResp.data : []
                            };
                        } catch (imageError) {
                            console.error('Error fetching images for hotel:', hotel.id, imageError);
                            return { ...hotel, images: [] };
                        }
                    }));
                    setData({ ...resp.data, hotelList });
                }
            } catch (e) {
                console.error('Error fetching hotel list:', e);
            }
        };
        selectList();
    }, [pageNo, searchType, keyword, minPrice, maxPrice, startDate, endDate, isSearching]);

    let isSeller = userInfo.role === 'role_seller';

    let moveToWrite = () => {
        navigate('/hotel/write', { state: { userInfo: userInfo } });
    };

    const handleSearchTypeChange = (e) => setSearchType(e.target.value);
    const handleKeywordChange = (e) => setKeyword(e.target.value);
    const handleMinPriceChange = (e) => setMinPrice(e.target.value);
    const handleMaxPriceChange = (e) => setMaxPrice(e.target.value);
    const handleStartDateChange = (e) => setStartDate(e.target.value);
    const handleEndDateChange = (e) => setEndDate(e.target.value);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setIsSearching(true);
        moveToPage(1);
    };

    const handleReset = () => {
        setSearchType('name');
        setKeyword('');
        setMinPrice('');
        setMaxPrice('');
        setStartDate('');
        setEndDate('');
        setIsSearching(false);
        moveToPage(1);
    };

    return (
        <Container className={"mt-3"}>
            <div className="row mt-3 mb-3">
                <div className="col-12">
                    <Form onSubmit={handleSearchSubmit}>
                        <div className="row mb-3">
                            <div className="col-md-3">
                                <Form.Select value={searchType} onChange={handleSearchTypeChange}>
                                    <option value="name">호텔명</option>
                                    <option value="address">주소</option>
                                </Form.Select>
                            </div>
                            <div className="col-md-3">
                                <Form.Control
                                    type="text"
                                    placeholder="검색어를 입력하세요"
                                    value={keyword}
                                    onChange={handleKeywordChange}
                                />
                            </div>
                            <div className="col-md-3">
                                <Form.Control
                                    type="number"
                                    placeholder="최소 가격"
                                    value={minPrice}
                                    onChange={handleMinPriceChange}
                                />
                            </div>
                            <div className="col-md-3">
                                <Form.Control
                                    type="number"
                                    placeholder="최대 가격"
                                    value={maxPrice}
                                    onChange={handleMaxPriceChange}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-3">
                                <Form.Control
                                    type="date"
                                    value={startDate}
                                    onChange={handleStartDateChange}
                                />
                            </div>
                            <div className="col-md-3">
                                <Form.Control
                                    type="date"
                                    value={endDate}
                                    onChange={handleEndDateChange}
                                />
                            </div>
                            <div className="col-md-3">
                                <Button className="btn btn-outline-primary" type="submit">검색</Button>
                            </div>
                            <div className="col-md-3">
                                <Button className="btn btn-outline-secondary" type="button" onClick={handleReset}>초기화</Button>
                            </div>
                        </div>
                    </Form>
                </div>
                <div className="row justify-content-start">
                    {isSeller && (
                        <div className="col-3">
                            <Button className="btn btn-outline-success" onClick={moveToWrite}>글 작성하기</Button>
                        </div>
                    )}
                </div>
            </div>
            <Table hover striped bordered className={"table-danger"}>
                <thead>
                <tr>
                    <td>글 번호</td>
                    <td>썸네일</td>
                    <td>호텔명</td>
                    <td>오너</td>
                    <td>설명</td>
                </tr>
                </thead>
                <tbody>
                {data.hotelList.length > 0 ? (
                    data.hotelList.map(b => (
                        <TableRow hotel={b} key={b.id} moveToSingle={moveToSingle} />
                    ))
                ) : (
                    <tr>
                        <td colSpan={5} className="text-center">호텔 리스트가 없습니다.</td>
                    </tr>
                )}
                <tr>
                    <td colSpan={5} className={"text-center"}>
                        <MyPagination
                            startPage={data.startPage}
                            endPage={data.endPage}
                            currentPage={data.currentPage}
                            maxPage={data.maxPage}
                            moveToPage={moveToPage}
                        />
                    </td>
                </tr>
                </tbody>
            </Table>
        </Container>
    );
}

let TableRow = ({ hotel, moveToSingle }) => {
    const thumbnailUrl = hotel.images && hotel.images.length > 0
        ? `http://localhost:8080/hotel/uploads/${hotel.id}/${hotel.roomNumber}/${hotel.images[Math.floor(Math.random() * hotel.images.length)]}`
        : '';

    return (
        <tr onClick={() => moveToSingle(hotel.id)}>
            <td>{hotel.id}</td>
            <td>
                <Image src={thumbnailUrl} thumbnail style={{ width: '100px', height: '100px' }} />
            </td>
            <td>{hotel.name}</td>
            <td>{hotel.nickname}</td>
            <td>{hotel.shortContent}</td>
        </tr>
    );
};

let MyPagination = ({ startPage, endPage, currentPage, maxPage, moveToPage }) => {
    let items = [];
    items.push(
        <Pagination.First key="first" onClick={() => moveToPage(1)} />
    );
    for (let i = startPage; i <= endPage; i++) {
        items.push(
            <Pagination.Item key={i} active={i === currentPage} onClick={() => moveToPage(i)}>
                {i}
            </Pagination.Item>
        );
    }
    items.push(
        <Pagination.Last key="last" onClick={() => moveToPage(maxPage)} />
    );
    return (
        <Pagination className={"justify-content-center"}>
            {items}
        </Pagination>
    );
};

export default ShowList;
