package com.nc13.Hotel_Spring.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HotelDTO {
    public int id;
    public String name;
    public String address;
    public Date startEntry;
    public Date endEntry;
    public boolean booked;
    public double price;
    public int sellerId;
    public String content;
    public String shortContent;
    public int roomNumber;
    public int roomType;
    public int roomMember;
    public String nickname;
    private List<String> imagePaths;
    private String thumbnail;
}
