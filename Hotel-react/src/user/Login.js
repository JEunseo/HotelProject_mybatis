import {Button, Col, Container, Form} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

let Login = () => {

    let navigate = useNavigate();

    let onSubmit = () => {
        /*
        setInputs({
            ...inputs,
            [id]: inputs,
        })
        */

        navigate('/');
    }

    let moveToRegister = () => {
        navigate('/register');
    }

    let loginStyle = {
        width: '40%',
        height: '300px'
    }
    let wrapStyle = {
        position: 'absolute',
        top:'50%',
        left:'50%',
        transform: 'translate(-50%, -50%)',
        width:'50%',
        height: '40%',
        backgroundColor: '#439798',
        padding:'20px 30px 20px 30px',
        borderRadius: '40px',
    }

    return (
        <div style={wrapStyle}>
            <Container style={loginStyle} className={"justify-content-md-center"}>
                <Form className={"align-items-center mt-5"}>
                    <Col>
                        <Form.Control placeholder="ID"/>
                    </Col>
                    <Col className={'mt-5 mb-5'}>
                        <Form.Control placeholder="PASSWORD"/>
                    </Col>
                    <Button onClick={onSubmit} className={'m-lg-3'}>로그인</Button>
                    <Button onClick={moveToRegister}>회원가입</Button>
                </Form>
            </Container>
        </div>
    )
}

export default Login;