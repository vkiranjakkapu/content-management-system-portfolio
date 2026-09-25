package com.cms.maintenance.services.imp;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.cms.maintenance.dto.CreateImageRequestDto;
import com.cms.maintenance.dto.UpdateImageRequestDto;
import com.cms.maintenance.enums.BusinessExceptions;
import com.cms.maintenance.enums.StorageExceptions;
import com.cms.maintenance.exceptions.BusinessException;
import com.cms.maintenance.models.Media;
import com.cms.maintenance.models.Profile;
import com.cms.maintenance.properties.DefaultProperties;
import com.cms.maintenance.repositories.MediaRepository;
import com.cms.maintenance.services.MediaService;
import com.cms.maintenance.services.ProfileService;
import com.cms.maintenance.services.StorageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MediaServiceImp implements MediaService {

    private final MediaRepository mediaRepository;
    private final ProfileService profileService;
    private final StorageService storageService;
    private final DefaultProperties properties;

    @Override
    public List<Media> getAllMediaByIds(List<UUID> ids) {
        return mediaRepository.findAllByIdIn(ids);
    }

    @Override
    public Media getMediaById(UUID id) {
        return mediaRepository.findById(id).orElseThrow(
                () -> new BusinessException(BusinessExceptions.RESOURCE_NOT_FOUND, "Image with given Id not found."));
    }

    @Override
    public Media createMedia(CreateImageRequestDto request) {
        String fileName = resolvedFileName(request.file());

        if (fileName.contains("..")) {
            throw new BusinessException(StorageExceptions.ILLEGAL_ARGUMENTS,
                    "Filename contains invalid path sequence: " + fileName);
        }

        if (!properties.getMedia().getAllowedExts().contains(Arrays.asList(fileName.split(".")).getLast())) {
            throw new BusinessException(StorageExceptions.INVALID_FILE, "File not supported to be uploaded");
        }

        Media media = storageService.saveMedia(fileName, request.file());

        Profile profile = profileService.getCurrentUserProfile();
        media.setProfile(profile);

        media.setTag(request.tag());

        return mediaRepository.save(media);
    }

    @Override
    public Media updateMedia(UpdateImageRequestDto request) {
        Media media = getMediaById(request.id());
        media.setTag(request.tag());

        return mediaRepository.save(media);
    }

    @Override
    public void deleteMediaById(UUID id) {
        storageService.deleteMedia(getMediaById(id));
        mediaRepository.deleteById(id);
    }

    private String resolvedFileName(MultipartFile file) {
        if (file != null && StringUtils.hasText(file.getOriginalFilename())) {
            return file.getOriginalFilename();
        }
        return profileService.getCurrentUserProfile().getId().toString();
    }

}
