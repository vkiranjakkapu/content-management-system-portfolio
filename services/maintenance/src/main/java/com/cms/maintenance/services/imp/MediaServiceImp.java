package com.cms.maintenance.services.imp;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.cms.maintenance.dto.CreateMediaRequestDto;
import com.cms.maintenance.dto.MediaResponseDto;
import com.cms.maintenance.dto.UpdateMediaRequestDto;
import com.cms.maintenance.enums.BusinessExceptions;
import com.cms.maintenance.enums.MediaTag;
import com.cms.maintenance.enums.StorageExceptions;
import com.cms.maintenance.exceptions.BusinessException;
import com.cms.maintenance.models.Media;
import com.cms.maintenance.models.Profile;
import com.cms.maintenance.properties.DefaultProperties;
import com.cms.maintenance.repositories.MediaRepository;
import com.cms.maintenance.services.MediaService;
import com.cms.maintenance.services.StorageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MediaServiceImp implements MediaService {

    private final MediaRepository mediaRepository;
    private final StorageService storageService;
    private final DefaultProperties properties;

    @Override
    public List<Media> getAllMedia(Profile profile) {
        return mediaRepository.findAllByProfileOrderByUpdatedAtDesc(profile);
    }

    @Override
    public List<Media> getAllMediaByTag(MediaTag tag, Profile profile) {
        return mediaRepository.findAllByTagAndProfileOrderByUpdatedAtDesc(tag, profile);
    }

    @Override
    public List<Media> getAllMediaByTagIn(List<MediaTag> tags, Profile profile) {
        return mediaRepository.findAllByTagInAndProfileOrderByUpdatedAtDesc(tags, profile);
    }

    @Override
    public List<Media> getAllMediaByIds(Collection<UUID> ids) {
        return mediaRepository.findAllByIdIn(ids);
    }

    @Override
    public Media getMediaById(UUID id) {
        return mediaRepository.findById(id).orElseThrow(
                () -> new BusinessException(BusinessExceptions.RESOURCE_NOT_FOUND, "Image with given Id not found."));
    }

    @Override
    public Media createMedia(CreateMediaRequestDto request, Profile profile) {
        String fileName = resolvedFileName(request.file());

        if (fileName.contains("..")) {
            throw new BusinessException(StorageExceptions.ILLEGAL_ARGUMENTS,
                    "Filename contains invalid path sequence: " + fileName);
        }

        if (!properties.getMedia().getAllowedExts().contains(Arrays.asList(fileName.split("\\.")).getLast())) {
            throw new BusinessException(StorageExceptions.INVALID_FILE, "File not supported to be uploaded",
                    HttpStatus.UNSUPPORTED_MEDIA_TYPE);
        }

        Media media = new Media();
        media.setProfile(profile);
        media.setMediaName(fileName);
        media.setMediaType(request.file().getContentType());
        media.setTag(request.tag());

        media = mediaRepository.save(media);

        try {
            // Media path will be attached
            media = storageService.saveMedia(media, request.file());

            return mediaRepository.save(media);

        } catch (Exception e) {
            e.printStackTrace();
            mediaRepository.delete(media);
            storageService.deleteMedia(media);

            throw new BusinessException(StorageExceptions.STORAGE_ERROR,
                    "Failed to save file.");
        }
    }

    @Override
    public Media updateMedia(UpdateMediaRequestDto request) {
        Media media = getMediaById(request.id());
        media.setTag(request.tag());

        return mediaRepository.save(media);
    }

    @Override
    public void deleteMediaById(UUID id) {
        Media media = getMediaById(id);
        try {
            mediaRepository.deleteById(id);
            storageService.deleteMedia(media);
        } catch (DataIntegrityViolationException e) {
            throw new BusinessException(BusinessExceptions.RESOURCE_IN_USE,
                    "Can't delete '" + media.getMediaName() + "'. This media was in use for '" + extractViolatedTable(e)
                            + "'");
        }

    }

    @Override
    public MediaResponseDto mapToResponse(Media media, boolean includeMedia) {

        if (media == null) {
            return null;
        }

        try {
            if (includeMedia) {
                byte[] data;

                if (!properties.getStorage().getProvider().equals("local")
                        && media.getMediaPath().contains("filestore")) {
                    data = new byte[0];
                } else {
                    data = storageService.getMedia(media);
                }

                return MediaResponseDto.builder()
                        .id(media.getId())
                        .media(data)
                        .mediaName(media.getMediaName())
                        .mediaType(media.getMediaType())
                        .tag(media.getTag())
                        .build();
            }

            return MediaResponseDto.builder()
                    .id(media.getId())
                    .mediaName(media.getMediaName())
                    .mediaType(media.getMediaType())
                    .tag(media.getTag())
                    .build();

        } catch (Exception e) {
            e.printStackTrace();
            throw new BusinessException(
                    StorageExceptions.STORAGE_ERROR,
                    "Error downloading data");
        }
    }

    private String resolvedFileName(MultipartFile file) {
        if (file != null && StringUtils.hasText(file.getOriginalFilename())) {
            return file.getOriginalFilename();
        }
        return UUID.randomUUID().toString();
    }

    private static final Pattern TABLE_PATTERN = Pattern.compile("table \"([^\"]+)\"");

    private static String extractViolatedTable(DataIntegrityViolationException ex) {
        String message = ex.getMostSpecificCause().getMessage();

        Matcher matcher = TABLE_PATTERN.matcher(message);

        // matcher.find() finds the first table (the one being updated/deleted)
        // matcher.find() a second time finds the table with the foreign key constraint
        if (matcher.find()) {
            String sourceTable = matcher.group(1); // e.g., "images"
            if (matcher.find()) {
                String targetTable = matcher.group(1); // e.g., "profiles"
                return targetTable;
            }
            return sourceTable;
        }

        return "unknown_table";
    }

}
