import React, { useState } from 'react';
import {Link} from "react-router-dom";
import {Stack} from "react-bootstrap";
import UserInfo from "../admin/UserInfo";

let Header = ({ userInfo }) => {
    const [showModal, setShowModal] = useState(false);
 const btnStyle = {
        padding: '10px 15px',
        backgroundColor: '#fff',
        color: '#439798',
        border: '1px solid #439798',
        borderRadius: '5px',
        fontSize: '14px',
        textDecoration: 'none',
    }

    let headerStyle = {
        background: '#ffffff',
        boxShadow:  '3px 5px 69px #bdbdbd, -15px -15px 45px #ffffff',
        padding: '0px',
        margin: '0px',
        marginBottom: '20px'
    }

    let ulStyle = {
        listStyleType: 'none',
        display: 'flex',
        alignItems: 'center',
    }
    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <header className={'container-fluid'} style={headerStyle}>
            <Stack direction="horizontal">
                <Link to={'/'}>
                    <img src={process.env.PUBLIC_URL + '/logo.png'} alt="로고"
                         style={{
                             width:'120px',
                             height:'auto'
                         }}/>
                </Link>
                <ul className={'flex ms-auto'} style={ulStyle}>
                    <li><span>환영합니다, {userInfo ? userInfo.nickname : 'Guest'}님. </span></li>
                    {/*사용자 역할에 따라 링크 표시 */}
                    {userInfo ? (
                        <>
                        {userInfo.role === 'role_admin' && (
                            <li className={'m-lg-3'}><Link to={'/admin/users'}  style={btnStyle}>회원 관리</Link></li>
                        )}
                        {userInfo.role === 'role_seller' && (
                            <li className={'m-lg-3'}><Link to={`/user/myhotel/${userInfo.id}`}  style={btnStyle}>내 호텔 관리</Link></li>
                        )}
                        {userInfo.role === 'role_customer' && (
                            <ul className={'flex ms-auto'} style={ulStyle}>
                                <li className={'m-lg-3'}>
                                    <button onClick={handleShowModal} style={btnStyle}>
                                        마이페이지
                                    </button>
                                </li>
                                <li className={'m-lg-3'}><Link to={`/user/basket/${userInfo.id}`}  style={btnStyle}>장바구니</Link></li>
                                <li className={'m-lg-3'}><Link to={`/user/basketChecked/${userInfo.id}`}  style={btnStyle}>예약내역</Link>
                                </li>
                            </ul>
                        )}
                            <li className={'m-lg-3'}><Link to={'/logout'}  style={btnStyle}>로그아웃</Link></li>
                        </>

                    ) : (
                        <li>
                            <span className={'m-lg-3'}><Link to={'/login'}  style={btnStyle}>로그인</Link></span>
                            <span className={'m-lg-3'}><Link to={'/register'}  style={btnStyle}>회원가입</Link></span>
                        </li>
                    )}
                </ul>
            </Stack>
            {userInfo && (
                <UserInfo
                    show={showModal}
                    onHide={handleCloseModal}
                    userId={userInfo.id}
                />
            )}
        </header>
    )
}

export default Header
