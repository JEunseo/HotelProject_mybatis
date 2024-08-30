import { Container, Pagination, Button } from "react-bootstrap";
import { useEffect, useState, useRef } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../component/Header";
import HotelCard from "../component/HotelCard";
import Footer from "../component/Footer";
import Banner from "../component/Banner";
import PopularHotel from "../component/PopularHotel";
import Nav from "../component/Nav";
import SearchForm from "../component/SearchForm";
import './Main.css';

let Main = () => {
    const location = useLocation();
    let userInfo = location.state?.userInfo;
    let params = useParams();
    let pageNo = parseInt(params.pageNo, 10) || 1;
    const popularRef = useRef(null);
    const hotelRef = useRef(null);

    const [data, setData] = useState({ hotelList: [] });
    const [searchType, setSearchType] = useState('name');
    const [keyword, setKeyword] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHotelList = async () => {
            try {
                let apiUrl = `http://localhost:8080/hotel/showList/${pageNo}`;
                let params = {};

                if (isSearching) {
                    params = searchQuery;
                }

                const queryParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== ''));

                let resp = await axios.get(apiUrl, {
                    params: queryParams,
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
                            console.error('이미지 가져오기 오류:', hotel.id, imageError);
                            return { ...hotel, images: [] };
                        }
                    }));
                    setData({ ...resp.data, hotelList });
                }
            } catch (e) {
                console.error('호텔 리스트 가져오기 오류:', e);
            }
        };

        fetchHotelList();
    }, [pageNo, searchQuery, isSearching]);

    const moveToPage = (pageNo) => {
        navigate(`/hotel/main/${pageNo}?searchType=${searchType}&keyword=${keyword}&minPrice=${minPrice}&maxPrice=${maxPrice}&startDate=${startDate}&endDate=${endDate}`, { state: { userInfo: userInfo } });
    };

    const moveToWrite = () => {
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

        const initialKeyword = '';
        const initialMinPrice = '';
        const initialMaxPrice = '';
        const initialStartDate = '';
        const initialEndDate = '';


        if (
            keyword === initialKeyword &&
            minPrice === initialMinPrice &&
            maxPrice === initialMaxPrice &&
            startDate === initialStartDate &&
            endDate === initialEndDate
        ) {
            handleResetSearch();
        } else {
            // 초기값과 다르다면 검색 실행
            setSearchQuery({
                searchType,
                keyword,
                minPrice,
                maxPrice,
                startDate,
                endDate
            });
            setIsSearching(true);
            moveToPage(1);
        }
    };

    const handleResetSearch = () => {
        setSearchType('name');
        setKeyword('');
        setMinPrice('');
        setMaxPrice('');
        setStartDate('');
        setEndDate('');
        setSearchQuery({});
        setIsSearching(false);
        moveToPage(1);
    };

    const btnStyle = {
        padding: '8px 10px',
        backgroundColor: '#439798',
        color: 'white',
        border: '1px solid white',
        borderRadius: '5px',
        fontSize: '14px',
        textDecoration: 'none',
    }

    return (
        <>
            <Header userInfo={userInfo} />
            <Nav />
            <Container fluid style={{ width: '80%' }}>
                <SearchForm
                    searchType={searchType}
                    keyword={keyword}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    startDate={startDate}
                    endDate={endDate}
                    handleSearchTypeChange={handleSearchTypeChange}
                    handleKeywordChange={handleKeywordChange}
                    handleMinPriceChange={handleMinPriceChange}
                    handleMaxPriceChange={handleMaxPriceChange}
                    handleStartDateChange={handleStartDateChange}
                    handleEndDateChange={handleEndDateChange}
                    handleSearchSubmit={handleSearchSubmit}
                />
                {userInfo?.role === 'role_seller' && (
                    <Button onClick={moveToWrite} className="mb-3" style={btnStyle}>
                        글 작성하기
                    </Button>
                )}
                <Container className={"mt-3"}>
                    {data.hotelList.length > 0 ? (
                        <div className="row">
                            {data.hotelList.map(hotel => (
                                <div className="col-md-4 mb-4" key={hotel.id}>
                                    <HotelCard hotel={hotel} userInfo={userInfo} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center">검색 결과가 없습니다.</div>
                    )}
                    <div className={"text-center mt-3"}>
                        <MyPagination
                            startPage={data.startPage}
                            endPage={data.endPage}
                            currentPage={data.currentPage}
                            maxPage={data.maxPage}
                            moveToPage={moveToPage}
                        />
                    </div>
                </Container>
                <Banner />
                <PopularHotel max={8} id={'popular'} ref={popularRef} />
            </Container>
            <Footer />
        </>
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

export default Main;