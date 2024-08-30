import {Button, Col, Container, Row} from "react-bootstrap";
import {FaStar} from "react-icons/fa";
import React from "react";
import {useLocation} from "react-router-dom";

let UserList = ({data, onUpdate, onDelete}) => {
    let ARRAY = [0, 1, 2, 3, 4]
    const location = useLocation()
    let userInfo = location.state?.userInfo || {id: null}

    let modifyDate = (dateString) => {
        let date = new Date(dateString)
        return date.toLocaleDateString('ko-KR', {
            year: '2-digit',
            month: '2-digit'
        }).replace('.', '년').replace('.', '월')
    }

    let getRoomTypeText = (roomType) => {
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
    let iconStyle = {
        width: '15px',
        height: 'auto'
    }

    let iconTextStyle = {
        height: '20px',
        lineHeight: '20px',
        fontSize: '15px'
    }
    let noneBullet = {
        listStyleType: 'none',
        padding: 0,
        margin: 0
    }

    const btnStyle = {
        padding: '5px 10px',
        backgroundColor: '#439798',
        color: 'white',
        border: '1px solid white',
        borderRadius: '5px',
        fontSize: '14px',
        textDecoration: 'none',
    }

    let btnBackStyle ={
        padding: '5px 10px',
        backgroundColor: '#fff',
        color: '#439798',
        border: '1px solid #439798',
        borderRadius: '5px',
        fontSize: '14px',
        textDecoration: 'none',
    }

    return (
        <Container className="py-3">
            <Row className="mb-6">
                <Col sm={5}>
                    <ul style={noneBullet}>
                        <li style={{listStyleType:'none'}}>
                            <img src={data.profileImage} alt={"User Image"} style={{width: '50px', height: "auto"}}/>
                            <span> {data.nickname}</span>
                        </li>
                        <li>
                            <img src={process.env.PUBLIC_URL + '/homeIcon.png'} alt={"Home icon"} style={iconStyle}/>
                            <span style={iconTextStyle}> 룸타입: {getRoomTypeText(data.roomType)}</span>
                        </li>
                        <li>
                            <img src={process.env.PUBLIC_URL + '/calendarIcon.png'} alt={"Calendar icon"}
                                 style={iconStyle}/>
                            <span style={iconTextStyle}> 투숙일: {modifyDate(data.startEntry)}</span>
                        </li>
                        <li>
                            <img src={process.env.PUBLIC_URL + '/editIcon.png'} alt={"Edit icon"} style={iconStyle}/>
                            <span style={iconTextStyle}> 작성일: {modifyDate(data.modifyDate)}</span>
                        </li>
                    </ul>
                </Col>
                <Col sm={5}>
                    <ul style={noneBullet}>
                        <li style={{width: '100%'}}>
                            <div style={{width: '53%', display: 'inline-block'}}>
                                {ARRAY.map((element) => (
                                    <FaStar
                                        key={element}
                                        size="14"
                                        color={element < data.score ? "#ffc107" : "#e4e5e9"}
                                    />
                                ))}{' '}
                                {data.score}.0
                            </div>
                            <div style={{width: '47%', display: 'inline-block'}}>
                                {parseInt(data.customerId) === parseInt(userInfo.id) &&
                                    <span>
                                    <Button onClick={() => onUpdate(data.id)} style={btnStyle}>수정</Button>
                                    <Button onClick={() => onDelete(data.id)} style={btnBackStyle} className={'m-lg-2'}>삭제</Button>
                                </span>
                                }
                            </div>
                        </li>
                        <textarea className="my-1"
                                  style={{width: '100%', height: '130px', rowGap: '3'}}
                                  disabled={true}>{data.content}</textarea>

                    </ul>
                </Col>
            </Row>
        </Container>
    )
}


export default UserList