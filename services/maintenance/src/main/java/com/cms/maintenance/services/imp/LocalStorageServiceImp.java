package com.cms.maintenance.services.imp;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.web.multipart.MultipartFile;

import com.cms.maintenance.enums.StorageExceptions;
import com.cms.maintenance.exceptions.BusinessException;
import com.cms.maintenance.models.Media;
import com.cms.maintenance.properties.LocalStorageProperties;
import com.cms.maintenance.services.CurrentUserService;
import com.cms.maintenance.services.StorageService;

public class LocalStorageServiceImp implements StorageService {

    private final CurrentUserService currentUser;
    private final Path storageLocation;

    public LocalStorageServiceImp(LocalStorageProperties properties, CurrentUserService currentUserService) {
        this.currentUser = currentUserService;
        this.storageLocation = Path.of(properties.basePath()).toAbsolutePath().normalize();
        try {
            Files.createDirectories(storageLocation);
        } catch (IOException e) {
            e.printStackTrace();
            throw new BusinessException(StorageExceptions.STORAGE_ERROR, "Could not create the root directory.", e);
        }
    }

    @Override
    public Media saveMedia(Media media, MultipartFile file) {

        try {
            String storageId = media.getId().toString();

            Path uniqueDir = getUserPath().resolve(storageId);
            if (Files.notExists(uniqueDir)) {
                Files.createDirectories(uniqueDir);
            }

            Path targetDir = uniqueDir.resolve(media.getMediaName());
            Files.copy(file.getInputStream(), targetDir, StandardCopyOption.REPLACE_EXISTING);

            media.setMediaPath(targetDir.toString());

            return media;
        } catch (IOException e) {
            e.printStackTrace();
            throw new BusinessException(StorageExceptions.STORAGE_ERROR, "Error while saving file.");
        }
    }

    @Override
    public byte[] getMedia(Media media) {
        try {
            Resource resource = new UrlResource(Path.of(media.getMediaPath()).toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return new byte[0];
            }

            return resource.getContentAsByteArray();

        } catch (IOException e) {
            e.printStackTrace();
            throw new BusinessException(StorageExceptions.STORAGE_ERROR, "Failed to load file", e);
        }
    }

    @Override
    public void deleteMedia(Media media) {
        try {
            Files.deleteIfExists(Path.of(media.getMediaPath()));
        } catch (IOException e) {
            e.printStackTrace();
            throw new BusinessException(StorageExceptions.STORAGE_ERROR, "Error deleting media file.");
        }
    }

    private Path getUserPath() {
        Path userDir = storageLocation.resolve(currentUser.userId().toString());
        try {
            if (Files.notExists(userDir))
                Files.createDirectories(userDir);
            return userDir;
        } catch (IOException e) {
            e.printStackTrace();
            throw new BusinessException(StorageExceptions.STORAGE_ERROR, "Could not create the user directory.", e);
        }
    }

}
