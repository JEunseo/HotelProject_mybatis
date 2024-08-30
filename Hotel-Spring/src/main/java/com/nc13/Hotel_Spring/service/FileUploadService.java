package com.nc13.Hotel_Spring.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;

@Service
public class FileUploadService {

    private static final String UPLOAD_DIR = "uploads";

    public void uploadFile(MultipartFile file, String id, String roomNumber) throws IOException {
        String currentWorkingDir = System.getProperty("user.dir");
        System.out.println(id);

        String fileUploadPath = Paths.get(currentWorkingDir, UPLOAD_DIR, id, roomNumber).toString();
        File uploadDirFile = new File(fileUploadPath);

        if (!uploadDirFile.exists()) {
            if (uploadDirFile.mkdirs()) {
                System.out.println("Directory created: " + uploadDirFile.getAbsolutePath());
            } else {
                throw new IOException("Failed to create directory: " + uploadDirFile.getAbsolutePath());
            }
        }

        File destinationFile = new File(uploadDirFile, file.getOriginalFilename());
        try {
            file.transferTo(destinationFile);
            System.out.println("File saved: " + destinationFile.getAbsolutePath());
        } catch (IOException e) {
            e.printStackTrace();
            throw new IOException("Failed to save file: " + destinationFile.getAbsolutePath(), e);
        }
    }


}
