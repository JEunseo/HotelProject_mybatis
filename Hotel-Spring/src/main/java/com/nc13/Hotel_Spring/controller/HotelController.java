package com.nc13.Hotel_Spring.controller;


import com.nc13.Hotel_Spring.Model.HotelDTO;
import com.nc13.Hotel_Spring.service.FileUploadService;
import com.nc13.Hotel_Spring.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@CrossOrigin
@RequestMapping("/hotel/")
public class HotelController {
    private static final String UPLOAD_DIR = "uploads";

    private final HotelService HOTEL_SERVICE;
    private final FileUploadService fileUploadService;

    @Autowired
    public HotelController(HotelService hotelService, FileUploadService fileUploadService) {
        HOTEL_SERVICE = hotelService;
        this.fileUploadService = fileUploadService;
    }
    @GetMapping("uploads/{id}/{roomNumber}/{filename}")
    public ResponseEntity<Resource> getFile(@PathVariable String id, @PathVariable String roomNumber, @PathVariable String filename) {
        File file = Paths.get(UPLOAD_DIR, id, roomNumber, filename).toFile();


        if (file.exists() && file.isFile()) {
            Resource resource = new FileSystemResource(file);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .body(resource);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("showOne/{id}")
    public HashMap<String, Object> selectOne(@PathVariable int id) {
        HashMap<String, Object> map = new HashMap<>();
        HotelDTO hotelDTO = HOTEL_SERVICE.selectOne(id);
        map.put("hotelDTO", hotelDTO);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        map.put("startDate", sdf.format(hotelDTO.getStartEntry()));
        map.put("endDate", sdf.format(hotelDTO.getEndEntry()));
        return map;
    }

    @GetMapping("images/{id}/{roomNumber}")
    public ResponseEntity<List<String>> listImages(@PathVariable String id, @PathVariable String roomNumber) {
        Path directory = Paths.get(UPLOAD_DIR, id, roomNumber);
        List<String> imageNames = new ArrayList<>();
        try {
            Files.list(directory)
                    .filter(Files::isRegularFile)
                    .forEach(path -> imageNames.add(path.getFileName().toString()));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        return ResponseEntity.ok(imageNames);
    }

    @GetMapping("showList/{pageNo}")
    public ResponseEntity<HashMap<String, Object>> selectList(
            @PathVariable int pageNo,
            @RequestParam(value = "searchType", required = false) String searchType,
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "minPrice", required = false) Double minPrice,
            @RequestParam(value = "maxPrice", required = false) Double maxPrice,
            @RequestParam(value = "startDate", required = false) String startDate,
            @RequestParam(value = "endDate", required = false) String endDate) {

        HashMap<String, Object> resultMap = new HashMap<>();
        int maxPage = HOTEL_SERVICE.selectMaxPage();
        int startPage = 1;
        int endPage = 1;

        if (maxPage < 5) {
            endPage = maxPage;
        } else if (pageNo <= 3) {
            endPage = 5;
        } else if (pageNo >= maxPage - 2) {
            startPage = maxPage - 4;
            endPage = maxPage;
        } else {
            startPage = pageNo - 2;
            endPage = pageNo + 2;
        }

        resultMap.put("currentPage", pageNo);
        resultMap.put("startPage", startPage);
        resultMap.put("endPage", endPage);
        resultMap.put("maxPage", maxPage);

        List<HotelDTO> list = HOTEL_SERVICE.searchHotels(searchType, keyword, minPrice, maxPrice, startDate, endDate, pageNo);
        resultMap.put("hotelList", list);

        return ResponseEntity.ok(resultMap);
    }


    @GetMapping("uploads/{id}/{roomNumber}")
    public ResponseEntity<List<String>> listFiles(@PathVariable String id, @PathVariable String roomNumber) {
        Path dirPath = Paths.get(UPLOAD_DIR, id, roomNumber);
        File dir = dirPath.toFile();

        if (!dir.exists() || !dir.isDirectory()) {
            return ResponseEntity.notFound().build();
        }

        File[] files = dir.listFiles();
        List<String> fileNames = new ArrayList<>();

        if (files != null) {
            for (File file : files) {
                if (file.isFile()) {
                    fileNames.add(file.getName());
                }
            }
        }

        return ResponseEntity.ok(fileNames);
    }

    @PostMapping("uploads")
    public Map<String, Object> uploadFiles(
            @RequestParam("id") String id,
            @RequestParam("roomNumber") String roomNumber,
            @RequestParam("files") List<MultipartFile> files) {

        Map<String, Object> resultMap = new HashMap<>();
        List<String> uploadPaths = new ArrayList<>();

        for (MultipartFile file : files) {
            if (file != null && !file.isEmpty()) {
                try {
                    fileUploadService.uploadFile(file, id, roomNumber);
                    uploadPaths.add("/uploads/" + id + "/" + roomNumber + "/" + file.getOriginalFilename());
                } catch (IOException e) {
                    resultMap.put("error", "파일 업로드 실패: " + e.getMessage());
                    return resultMap;
                }
            }
        }

        resultMap.put("uploaded", true);
        resultMap.put("urls", uploadPaths);
        return resultMap;
    }

    @PostMapping("write")
    public HashMap<String, Object> write(@RequestBody HotelDTO hotelDTO) {
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            HOTEL_SERVICE.insert(hotelDTO);
            resultMap.put("result", "success");
            resultMap.put("resultId", hotelDTO.getId());
        } catch (Exception e) {
            resultMap.put("result", "fail");
        }
        return resultMap;
    }

    @PostMapping("update")
    public HashMap<String, Object> update(@RequestBody HotelDTO hotelDTO) {
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            HOTEL_SERVICE.update(hotelDTO);
            resultMap.put("result", "success");
            resultMap.put("destId", hotelDTO.getId());
        } catch (Exception e) {
            resultMap.put("result", "fail");
        }
        return resultMap;
    }

    @GetMapping("delete/{id}")
    public ResponseEntity<Void> deleteHotel(@PathVariable int id) {
        HOTEL_SERVICE.delete(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("delete/{hotelId}")
    public ResponseEntity<String> delete(@PathVariable int hotelId) {
        if(HOTEL_SERVICE.deleteHotelById(hotelId)){
            return new ResponseEntity<>("호텔이 삭제되었습니다.", HttpStatus.OK);
        }else{
            return new ResponseEntity<>("호텔삭제에 실패했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    // @DeleteMapping("delete/{hotelId}")
    // public ResponseEntity<Void> deleteBasketItem(@PathVariable int hotelId) {
    //     // 장바구니에서 userId와 productId에 해당하는 항목을 삭제하는 로직
    //     boolean isDeleted = HOTEL_SERVICE.deleteHotelById(hotelId);
    //     if (isDeleted) {
    //         return ResponseEntity.noContent().build(); // 204 No Content 응답
    //     } else {
    //         return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // 404 Not Found 응답
    //     }
    // }
}
