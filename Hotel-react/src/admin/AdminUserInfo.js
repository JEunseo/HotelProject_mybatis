
import React, { useState, useEffect } from 'react';
import {Link, useParams} from "react-router-dom";
import UserInfo from "./UserInfo";
const AdminUserInfo = (props) => {
    const { userid: paramUserId } = useParams();
    const userid = props.userid || paramUserId;

    return(
        <div>
            <h1>관리자 - 회원정보</h1>
            <UserInfo userid={userid}/>
        </div>
    )
}



export default AdminUserInfo;