package com.nc13.Hotel_Spring.Model;

import lombok.Data;

import java.util.Date;

@Data
public class ReplyDTO {
    private int id;
    private int customerId;
    private int hotelId;
    private String title;
    private String content;
    private Date entryDate;
    private Date modifyDate;
    private int score;

    private String nickname;
    private int roomType;
    private Date startEntry;
    private String name;
}
