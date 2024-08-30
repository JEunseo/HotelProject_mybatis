import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {Button, Container} from "react-bootstrap";
import {FaStar} from "react-icons/fa";
import axios from "axios";
import Header from "../component/Header";

let ReplyWrite = () => {
    let {hotelId} = useParams()
    let location = useLocation()
    let userInfo = location.state?.userInfo || {id: null}
    let navigate = useNavigate()

    let [inputs, setInputs] = useState({
        id: '',
        hotelId: hotelId,
        customerId: userInfo.id,
        title: '',
        score: '',
        content: ''
    })

    let [message, setMessage] = useState('')

    let ARRAY = [1, 2, 3, 4, 5];
    let [score, setScore] = useState([false, false, false, false, false])

    let moveToNext = () => {
        navigate('/reply/replyList/' + hotelId, {state: {userInfo: userInfo}})
    }

    let starScore = (index) => {
        let newScore = ARRAY.map((_, i) => i < index);
        setScore(newScore);
        setInputs({
            ...inputs,
            score: index
        })
    }

    useEffect(() => {
        if (inputs.score >= 3) {
            setMessage('어떤 점이 만족스러웠나요?')
        } else {
            setMessage('어떤 점이 아쉬웠나요?')
        }
    }, [inputs.score])

    {
        ARRAY.map((el, index) => (
            <FaStar key={index} size="14"></FaStar>
        ))
    }

    let onChange = (e) => {
        let {name, value} = e.target
        setInputs({
            ...inputs,
            [name]: value
        })
    }
    let onSubmit = async (e) => {
        e.preventDefault()
        try {
            let resp = await axios.post('http://localhost:8080/reply/write', inputs, {
                withCredentials: true
            })
            console.log("resp data: ", resp.data)
            if (resp.status === 200) {
                moveToNext()
            }
        } catch (error) {
            console.error("onSubmit Error: ", error)
        }
    }
    let noneBullet = {
        listStyleType: 'none',
    }

    const btnStyle = {
        padding: '5px 10px',
        backgroundColor: '#439798',
        color: 'white',
        border: '1px solid white',
        borderRadius: '5px',
        fontSize: '14px',
        textDecoration: 'none',
        marginRight: '10px',
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
        <>
        <Header userInfo={userInfo}/>
        <Container classname={"mt-3"}>
            <form onSubmit={onSubmit}>
                <ul style={noneBullet}>
                    <div style={{fontWeight:'bold'}}>[리뷰 작성하기]</div>
                    <li>호텔은 만족하셨나요?</li>
                    <li style={noneBullet}>
                        {ARRAY.map((el, index) => (
                            <FaStar key={index} size="24"
                                    onClick={() => starScore(el)}
                                    color={score[index] ? "#ffc107" : "#e4e5e9"}
                                    style={{cursor: 'pointer'}}/>
                        ))}
                    </li>
                    <li style={noneBullet}>만족도 {inputs.score}점을 주셨네요.</li>
                    <li>{message}</li>
                    <li>제목</li>
                    <li style={noneBullet}>
                        <input type={'text'} value={inputs.title} name={'title'} onChange={onChange}>
                        </input>
                    </li>
                    <li>내용</li>
                    <li style={noneBullet}>
                    <textarea name={'content'} value={inputs.content} className={'form-control'}
                              onChange={onChange}/>
                    </li>
                   <li className={'mt-3'}>
                       <Button type={'submit'} style={btnStyle}>등록하기</Button>
                       <Button type={'button'} onClick={moveToNext} style={btnBackStyle}>뒤로가기</Button>
                   </li>
                </ul>
            </form>
        </Container>
        </>
    )
}
export default ReplyWrite