package com.cms.maintenance.services;

import org.springframework.web.multipart.MultipartFile;

import com.cms.maintenance.models.Media;

public interface StorageService {

    Media saveMedia(String fileName, MultipartFile file);

    byte[] getMedia(Media media);

    void deleteMedia(Media media);

}