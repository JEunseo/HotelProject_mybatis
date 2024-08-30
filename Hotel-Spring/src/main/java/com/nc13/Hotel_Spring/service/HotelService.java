package com.nc13.Hotel_Spring.service;

import com.nc13.Hotel_Spring.Model.HotelDTO;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

@Service
public class HotelService {
    private final SqlSession SESSION;
    private final String NAMESPACE = "mapper.HotelMapper";
    private final int PAGE_SIZE = 15;

    @Autowired
    public HotelService(SqlSession session) {
        SESSION = session;
    }

    public HotelDTO selectOne(int id) {
        return SESSION.selectOne(NAMESPACE + ".selectOne", id);
    }

    public List<HotelDTO> selectAll(int pageNo) {
        HashMap<String, Integer> paramMap = new HashMap<>();
        paramMap.put("startRow", (pageNo - 1) * PAGE_SIZE);
        paramMap.put("size", PAGE_SIZE);

        return SESSION.selectList(NAMESPACE + ".selectList", paramMap);
    }

    public int selectMaxPage() {
        int maxRow = SESSION.selectOne(NAMESPACE + ".selectMaxPage");
        int maxPage = maxRow / PAGE_SIZE;

        maxPage = (maxRow % PAGE_SIZE == 0) ? maxPage : maxPage + 1;

        return maxPage;
    }

    public void insert(HotelDTO hotelDTO) {
        SESSION.insert(NAMESPACE + ".insert", hotelDTO);
    }

    public void update(HotelDTO hotelDTO) {
        SESSION.update(NAMESPACE + ".update", hotelDTO);
    }

    public void delete(int id) {
        SESSION.delete(NAMESPACE + ".delete", id);
    }

    public List<HotelDTO> searchHotels(
            String searchType,
            String keyword,
            Double minPrice,
            Double maxPrice,
            String startDate,
            String endDate,
            int pageNo) {

        HashMap<String, Object> paramMap = new HashMap<>();
        paramMap.put("searchType", searchType);
        paramMap.put("keyword", keyword);
        paramMap.put("minPrice", minPrice);
        paramMap.put("maxPrice", maxPrice);
        paramMap.put("startDate", startDate);
        paramMap.put("endDate", endDate);
        paramMap.put("startRow", (pageNo - 1) * PAGE_SIZE);
        paramMap.put("size", PAGE_SIZE);

        return SESSION.selectList(NAMESPACE + ".searchHotels", paramMap);
    }

    public List<HotelDTO> selectAllHotelInBasketByUserID(int userId){
        return SESSION.selectList(NAMESPACE+".hotelInBucket",userId);
    }

    //관리자
    public List<HotelDTO> selectMyHotels(int sellerId){
        return SESSION.selectList(NAMESPACE+".selectMyHotel",sellerId);
    }
    public boolean deleteHotelById(int hotelId) {
        int result = SESSION.delete(NAMESPACE + ".deleteOne",hotelId);
        return result > 0; //삭제 성공 시 1 반환
    }
    //추가
    public void updateBooked(int hotelId) {
        SESSION.update(NAMESPACE+".updateBooked",hotelId);
    }
    public void cancelBooked(int hotelId) {
        SESSION.update(NAMESPACE+".cancelBooked",hotelId);
    }

}