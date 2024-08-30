import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./main/Main";
import Details from "./main/Details"; // 수정된 컴포넌트
import Login from "./user/Login";
import Register from "./user/Register";
import ScrollToTop from "./ScrollToTop";
import BasketByUser from "./basket/BasketByUser";
import BasketCheckedByUser from "./basket/BasketCheckedByUser";
import UserInfo from "./admin/UserInfo";
import AdminShowUserList from "./admin/AdminShowUserList";
import Auth from "./user/Auth";
import Logout from "./user/Logout";
import Update from "./hotel/Update";
import Write from "./hotel/Write";
import BucketList from "./basket/BucketList";
import MyHotelBySeller from "./seller/MyHotelBySeller";
import AdminshowUserOne from "./admin/AdminshowUserOne";
import AdminUserInfo from "./admin/AdminUserInfo";
import ReplyWrite from "./reply/ReplyWrite";
import ReplyUpdate from "./reply/ReplyUpdate";
import ReplyList from "./reply/ReplyList";

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop>
                <Routes>
                    {/* Main 페이지는 홈 페이지로 "/"로 설정 */}{/* Main페이지 "*"로 지정하면 로그인 시 userInfo전달이 안됨*/}
                    <Route path="/" element={<Main />} />

                    {/* 사용자 관련 페이지 */}
                    <Route path="/login" element={<Auth />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/user/mypage/:userid" element={<UserInfo />} />
                    {/*<Route path="/user/basket/:userid" element={<BasketByUser />} />*/}
                    <Route path="/user/myhotel/:sellerid" element={<MyHotelBySeller />}/>
                    <Route path="/user/basketChecked/:userid" element={<BasketCheckedByUser />} />
                    {/*헌재 - 장바구니*/}
                    <Route path="/user/basket/:userid" element={<BucketList/>}/>
                    {/*지혜 - 장바구니*/}
                    {/*<Route path="/user/basket/:userid" element={<BasketByUser />} />*/}
                    {/* 호텔 관련 페이지 */}
                    <Route path="/hotel/showOne/:id" element={<Details />} /> {/* 수정된 컴포넌트 */}
                    <Route path="/hotel/main/:pageNo" element={<Main />} />
                    <Route path="/hotel/write" element={<Write />} />
                    <Route path="/hotel/update/:id" element={<Update />} />
                    {/* 관리자 관련 페이지 */}
                    <Route path="/admin/users" element={<AdminShowUserList />} />
                    <Route path="/admin/user/:id" element={<AdminshowUserOne />} />
                    <Route path="/admin/userpage/:userid" element={<AdminUserInfo />} />
                    
                   
                    <Route path={"/details"} element={<Details/>}/>

                    <Route path={"/reply/write/:hotelId"} element={<ReplyWrite/>}/>
                    <Route path={"/reply/update/:id"} element={<ReplyUpdate/>}/>
                    <Route path={"/reply/replyList/:hotelId"} element={<ReplyList/>}/>
                </Routes>
            </ScrollToTop>
        </BrowserRouter>
    );
}

export default App;
