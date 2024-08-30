import {Container, Table, FormControl, Button, Form, Col} from "react-bootstrap";
import React, {useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import Header from "../component/Header";

let Auth = () => {
    let [inputs, setInputs] = useState({
        username: '',
        password: ''
    })

    let onChange = (e) => {
        let {name, value} = e.target
        setInputs({
            ...inputs,
            [name]: value
        })
    }

    let navigate = useNavigate()

    let onSubmit = async (e) => {
        e.preventDefault()
        let formData = new FormData()
        formData.append("username", inputs.username)
        formData.append("password", inputs.password)

        let response = await axios({
            url:'http://localhost:8080/user/auth',
            method:'POST',
            data:formData,
            withCredentials: true
        })

        if(response.status === 200 && response.data.result === 'success'){
            let userInfo = {
                id: response.data.id,
                role: response.data.role,
                nickname: response.data.nickname
            }
            window.alert('환영합니다, '+userInfo.nickname+'님.');
            navigate('/', {state:{userInfo:userInfo}})
        }else{
            window.alert('존재하지 않는 회원입니다.');
        }
    }

    let wrapStyle = {
        position: 'absolute',
        top:'50%',
        left:'50%',
        transform: 'translate(-50%, -50%)',
        width:'50%',
        height: '40%',
        background: '#ffffff',
        boxShadow:  '15px 15px 45px #bdbdbd, -15px -15px 45px #ffffff',
        margin: '0px',
        padding:'20px 30px 20px 30px',
        borderRadius: '40px',
    }

    let loginStyle = {
        width: '50%',
        height: '50%'
    }

    const btnStyle = {
        padding: '6px 12px',
        backgroundColor: '#439798',
        color: 'white',
        border: '1px solid white',
        borderRadius: '5px',
        fontSize: '14px',
        textDecoration: 'none',
    }

    let btnBackStyle = {
        padding: '6px 12px',
        backgroundColor: '#fff',
        color: '#439798',
        border: '1px solid #439798',
        borderRadius: '5px',
        fontSize: '14px',
        textDecoration: 'none',
    }

    let goBack = () => {
        navigate('/')
    }


    return (
       <div style={wrapStyle}>
           <Container style={loginStyle}>
               <Form onSubmit={onSubmit}>
                       <Col className={'mt-3'}>
                           <Form.Control
                               type="text"
                               placeholder="ID"
                               name="username"
                               value={inputs.username}
                               onChange={onChange}
                           />
                       </Col>
                       <Col className={'mt-3 mb-3'}>
                           <Form.Control  type={'password'}
                                          name={'password'}
                                          placeholder="PASSWORD"
                                          value={inputs.password}
                                          onChange={onChange}/>
                       </Col>
                   <div className={'mt-3 d-flex'}>
                       <Button type={'submit'} style={btnStyle}>로그인</Button>
                       <Link to={`/register`} type={'button'} style={btnStyle}>회원가입</Link>
                           <Button onClick={goBack} style={btnBackStyle} className={'ms-lg-auto d-flex'}>뒤로가기</Button>
                   </div>
               </Form>
           </Container>
       </div>
    )


}

export default Auth;