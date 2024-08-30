package com.nc13.Hotel_Spring.controller;

import com.nc13.Hotel_Spring.Model.ReplyDTO;
import com.nc13.Hotel_Spring.service.ReplyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/reply/")
public class ReplyController {
    private ReplyService REPLY_SERVICE;

    @Autowired
    public ReplyController(ReplyService REPLY_SERVICE) {
        this.REPLY_SERVICE = REPLY_SERVICE;
    }

    @GetMapping("selectList/{hotelId}")
    public HashMap<String, Object> showList(@PathVariable int hotelId,
                                            @RequestParam(defaultValue = "1") int page,
                                            @RequestParam(defaultValue = "2") int size,
                                            @RequestParam(defaultValue = "latest") String sort) {
        HashMap<String, Object> result = new HashMap<>();

        // !!!!!! 은서 : hotelId, userId 삭제 !!!!!
        result.put("replyList", REPLY_SERVICE.selectList(hotelId, page, size, sort));
        result.put("totalCount", REPLY_SERVICE.getTotalCount(hotelId));
        result.put("totalScore", REPLY_SERVICE.getTotalScore(hotelId));
        return result;
    }

    @GetMapping("selectOne/{id}")
    public HashMap<String, Object> showOne(@PathVariable int id) {
        HashMap<String, Object> result = new HashMap<>();
        result.put("replyOne", REPLY_SERVICE.selectOne(id));
        return result;
    }

    @PostMapping("write")
    public ResponseEntity<Map<String, Object>> write(@RequestBody ReplyDTO replyDTO) {
        Map<String, Object> resultMap = new HashMap<>();

        REPLY_SERVICE.insert(replyDTO);

        resultMap.put("title", replyDTO.getTitle());
        resultMap.put("content", replyDTO.getContent());
        resultMap.put("score", replyDTO.getScore());

        return ResponseEntity.ok(resultMap);
    }

    @PostMapping("update")
    public Map<String, Object> update(@RequestBody ReplyDTO replyDTO) {
        Map<String, Object> resultMap = new HashMap<>();

        boolean updateSuccess = REPLY_SERVICE.update(replyDTO);

        if (updateSuccess) {
            resultMap.put("success", true);
            resultMap.put("destId", replyDTO.getHotelId());
            resultMap.put("score", replyDTO.getScore());
            resultMap.put("title", replyDTO.getTitle());
            resultMap.put("content", replyDTO.getContent());
        } else {
            resultMap.put("success", false);
        }

        return resultMap;
    }

    @GetMapping("delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        REPLY_SERVICE.delete(id);

        return ResponseEntity.ok().build();
    }
}
