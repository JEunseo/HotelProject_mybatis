package com.nc13.Hotel_Spring.controller;

import com.nc13.Hotel_Spring.Model.BucketDTO;
import com.nc13.Hotel_Spring.Model.HotelDTO;
import com.nc13.Hotel_Spring.Model.UserDTO;
import com.nc13.Hotel_Spring.service.BucketService;
import com.nc13.Hotel_Spring.service.HotelService;
import com.nc13.Hotel_Spring.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")  // CORS 설정 추가
@RequestMapping("/user/")
public class BucketController {
    @Autowired
    private HotelService hotelService;
    @Autowired
    private BucketService bucketService;
    @Autowired
    private UserService userService;

    @GetMapping("{userid}") // UserInfo
    public UserDTO selectUserById(@PathVariable int userid){
        UserDTO user = userService.selectOneByID(userid);
        System.out.println(user.toString());
        return user;
    }
    @GetMapping("myhotel/{sellerId}")//내 호텔 관리
    public List<HotelDTO> myHotels(@PathVariable int sellerId){
        List<HotelDTO> myhotels = hotelService.selectMyHotels(sellerId);
        for(HotelDTO h : myhotels){
            System.out.println(sellerId+"번 판매자의 호텔: "+h.getSellerId()+"-"+h.getName());
        }
        return myhotels;
    }

    @GetMapping("basket/{userId}") // 장바구니 - 'bucket' INNER JOIN 'hotel' VS bucketId로 hotelId만 & 따로?
    public List<BucketDTO> myBasket(@PathVariable int userId){
        System.out.println("MyBucket");
        List<BucketDTO> newList = bucketService.bucketByUserId(userId);
        for(BucketDTO b : newList){
            System.out.println("(장바구니 확인) newBucketDTO: "+b.toString());
        }
        return newList;
    }

    @GetMapping("basketChecked/{userId}")
    public List<BucketDTO> myBasketChecked(@PathVariable int userId){
        System.out.println("CheckedinMyBucket");
        List<BucketDTO> newList = bucketService.bucketCheckedByUserId(userId);
        for(BucketDTO b : newList){
            System.out.println("newBucketDTO: "+b.toString());
        }
        return newList;
    }//bucketCheckedByUserId

    @DeleteMapping("basket/{bucketId}")
    public ResponseEntity<Void> deleteBasketItem(@PathVariable int bucketId) {
        boolean isDeleted = bucketService.deleteBucketById(bucketId);
        if (isDeleted) {
            System.out.println("삭제됨:bukcetID:"+bucketId);
            return ResponseEntity.noContent().build(); // 204 No Content 응답
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // 404 Not Found 응답
        }
    }
    @PostMapping("cancelReservation/{basketId}") //지혜 - 예약취소(hotel.booked = 0, payment = 0)
    public ResponseEntity<String> cancelReservation(@PathVariable int basketId) {
        try {
            System.out.println("basketId - "+basketId+"번 장바구니 boolean 변경");
            BucketDTO basketTOCancel = bucketService.selectOne(basketId);
            hotelService.cancelBooked(basketTOCancel.getHotelId());
            bucketService.cancelPayment(basketId);
            System.out.println("삭제할 basket("+basketId+"번)의 hotelid:"+basketTOCancel.getHotelId());
            return new ResponseEntity<>("예약 취소되었습니다.", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("예약취소에 실패했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);

        }

    }
    @PostMapping("book") //헌재 - 결제
    public ResponseEntity<String> bookHotel(@RequestBody BucketDTO bucketDTO) {
        int hotelId = bucketDTO.getHotelId();
        int basketId = bucketDTO.getId();
        System.out.println("예약할 hotelId,basketId:"+hotelId+"/"+basketId);
        try {
            bucketService.updatePayment(basketId);
            hotelService.updateBooked(hotelId);
            return new ResponseEntity<>("예약되었습니다.", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("예약에 실패했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PostMapping("indetails/addOnlyBasket") //호텔 상세페이지 - 장바구니(급하게)
    public ResponseEntity<String> addToCart(@RequestBody BucketDTO bucketDTO) {
        int hotelToBasket = bucketDTO.getHotelId();
        int customerToBasket = bucketDTO.getCustomerID();
        if(bucketService.checkDupicate(hotelToBasket,customerToBasket)){
            System.out.println("장바구니에 이미 담김");
            return new ResponseEntity<>("장바구니에 이미 담겼습니다.", HttpStatus.CONFLICT);
        }else{

            BucketDTO newBucketData = new BucketDTO();
            try {
                HotelDTO hotelToPut = hotelService.selectOne(hotelToBasket);
                newBucketData.setCustomerID(customerToBasket);
                newBucketData.setPayment(false); // 결제 X
                newBucketData.setHotelId(hotelToPut.getId());
                newBucketData.setHotelName(hotelToPut.getName());
                newBucketData.setStartEntry(hotelToPut.getStartEntry());
                newBucketData.setEndEntry(hotelToPut.getEndEntry());
                newBucketData.setPrice(hotelToPut.getPrice());
                newBucketData.setBooked(false); // 예약 X
                bucketService.insert(newBucketData);
                return new ResponseEntity<>("장바구니에 추가되었습니다.", HttpStatus.OK);
            } catch (Exception e) {
                e.printStackTrace();
                return new ResponseEntity<>("장바구니 추가에 실패했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }



}
