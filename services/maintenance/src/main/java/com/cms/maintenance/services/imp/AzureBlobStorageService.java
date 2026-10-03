package com.cms.maintenance.services.imp;

import java.io.ByteArrayInputStream;
import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobContainerClientBuilder;
import com.cms.maintenance.enums.StorageExceptions;
import com.cms.maintenance.exceptions.BusinessException;
import com.cms.maintenance.models.Media;
import com.cms.maintenance.properties.AzureStorageProperties;
import com.cms.maintenance.services.StorageService;

public class AzureBlobStorageService implements StorageService {

    private final BlobContainerClient containerClient;

    public AzureBlobStorageService(AzureStorageProperties properties) {
        this.containerClient = new BlobContainerClientBuilder()
                .connectionString(properties.connectionString())
                .containerName(properties.containerName()).buildClient();
        containerClient.createIfNotExists();
    }

    @Override
    public Media saveMedia(Media media, MultipartFile file) {

        String blobName = media.getId() + "-" + media.getMediaName();
        media.setMediaPath(blobName);

        BlobClient blobClient = containerClient.getBlobClient(blobName);

        try {
            blobClient.upload(new ByteArrayInputStream(file.getBytes()), true);
            return media;
        } catch (IOException e) {
            e.printStackTrace();
            throw new BusinessException(StorageExceptions.STORAGE_ERROR, "Error while storing media.");
        }
    }

    @Override
    public byte[] getMedia(Media media) {

        BlobClient blobClient = containerClient.getBlobClient(media.getMediaPath());

        return blobClient.downloadContent().toBytes();
    }

    @Override
    public void deleteMedia(Media media) {

        BlobClient blobClient = containerClient.getBlobClient(media.getMediaPath());

        blobClient.deleteIfExists();
    }

}
