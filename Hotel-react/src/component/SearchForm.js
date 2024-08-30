import {Button, Container, Form} from "react-bootstrap";

const SearchForm = ({
                        searchType,
                        keyword,
                        minPrice,
                        maxPrice,
                        startDate,
                        endDate,
                        isSeller,
                        handleSearchTypeChange,
                        handleKeywordChange,
                        handleMinPriceChange,
                        handleMaxPriceChange,
                        handleStartDateChange,
                        handleEndDateChange,
                        handleSearchSubmit,
                        moveToWrite
                    }) => {

    const btnStyle = {
        padding: '8px 5px',
        backgroundColor: '#439798',
        color: 'white',
        border: '1px solid white',
        borderRadius: '5px',
        fontSize: '14px',
        width: '100%'
    }

    return (
        <Container fluid>
            <Form className="mt-4" onSubmit={handleSearchSubmit}>
                <div className="row mb-3 w-80">
                    <div className="col-1">
                        <Form.Select value={searchType} onChange={handleSearchTypeChange}>
                            <option value="name">호텔명</option>
                            <option value="address">주소</option>
                        </Form.Select>
                    </div>
                    <div className="col-2">
                        <Form.Control
                            type="text"
                            placeholder="검색어를 입력해주세요3"
                            value={keyword}
                            onChange={handleKeywordChange}
                        />
                    </div>
                    <div className="col-2">
                        <Form.Control
                            type="number"
                            placeholder="최소가격"
                            value={minPrice}
                            onChange={handleMinPriceChange}
                        />
                    </div>
                    <div className="col-2">
                        <Form.Control
                            type="number"
                            placeholder="최대가격"
                            value={maxPrice}
                            onChange={handleMaxPriceChange}
                        />
                    </div>
                    <div className="col-2">
                        <Form.Control
                            type="date"
                            value={startDate}
                            onChange={handleStartDateChange}
                        />
                    </div>
                    <div className="col-2">
                        <Form.Control
                            type="date"
                            value={endDate}
                            onChange={handleEndDateChange}
                        />
                    </div>
                    <div className="col-1">
                        <Button className="btn" type="submit" style={btnStyle}>검색</Button>
                        {isSeller && (
                            <div className="col-1">
                                <Button className="btn btn-outline-success" onClick={moveToWrite} style={btnStyle}>호텔 추가하기</Button>
                            </div>
                        )}
                    </div>
                </div>
            </Form>
        </Container>
    );
};

export default SearchForm;
