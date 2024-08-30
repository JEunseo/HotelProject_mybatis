package com.nc13.Hotel_Spring.service;

import com.nc13.Hotel_Spring.Model.BucketDTO;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Service
public class BucketService {
    public SqlSession SESSION;
    private final String NAMESPACE = "mapper.BucketMapper";
    @Autowired
    public BucketService(SqlSession session) {
        SESSION = session;
    }

    //장바구니 (userId로 조회)
    public List<BucketDTO> bucketByUserId(int userId){
        return SESSION.selectList(NAMESPACE+".bucketByUserId",userId);
        //booked 0인 것들만 갖고오도록 했다가 -> 개선 방안 생각남 -> 1인 것들도 갖고왔다가 나중에 프론트단에서 블러처리? ->안되면 where 절에 booked = 0 추가하겠음
    }
    //장바구니 - 결제완료 (userId로 조회)
    public List<BucketDTO> bucketCheckedByUserId(int userId){
        return SESSION.selectList(NAMESPACE+".bucketCheckedByUserId",userId);
    }
    public void updatePayment(int bucketId) {
        SESSION.update(NAMESPACE+".updatePayment",bucketId);
    }
    public void cancelPayment(int bucketId) {
        SESSION.update(NAMESPACE+".cancelPayment",bucketId);
    }

    //삭제할 때는 basketId로 삭제해야함
    public boolean deleteBucketById(int bucketId) {
        int result = SESSION.delete(NAMESPACE + ".deleteOne",bucketId);
        return result > 0; //삭제 성공 시 1 반환
    }

    // 추가된 내용
    public List<BucketDTO> selectAll() {
        return SESSION.selectList(NAMESPACE + ".selectAll");
    }

    public BucketDTO selectOne(int id) {
        return SESSION.selectOne(NAMESPACE + ".selectOne", id);
    }

    public void insert(BucketDTO bucketDTO) {
        System.out.println("장바구니 넣을 data:"+bucketDTO.toString());
        SESSION.insert(NAMESPACE + ".insert", bucketDTO);
    }

    public void update(BucketDTO bucketDTO) {
        SESSION.update(NAMESPACE + ".update", bucketDTO);
    }

    public void delete(int id) {
        SESSION.delete(NAMESPACE + ".delete", id);
    }
    public boolean checkDupicate(int hotelId,int customerId){
        Map<String,Integer> checkInfo = new HashMap<>();
        checkInfo.put("hotelId",hotelId);
        checkInfo.put("customerId",customerId);
        System.out.println("map-호텔ID:"+checkInfo.get("hotelId"));
        System.out.println("map-고객ID:"+checkInfo.get("customerId"));
        int count = SESSION.selectOne(NAMESPACE + ".checkDuplicate",checkInfo);
        return count >= 1; //count 2 이상인지에 대한 boolean (중복이면 true)
    }

}
