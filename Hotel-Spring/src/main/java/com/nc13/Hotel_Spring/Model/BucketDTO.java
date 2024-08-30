package com.nc13.Hotel_Spring.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BucketDTO {
    private int id;
    private int customerID;
    private boolean payment;
    private int hotelId;
    private String hotelName;
    private Date startEntry;
    private Date endEntry;
    private Double price;
    private boolean booked;

}
