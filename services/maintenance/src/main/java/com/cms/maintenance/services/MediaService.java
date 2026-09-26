package com.cms.maintenance.services;

import java.util.List;
import java.util.UUID;

import com.cms.maintenance.dto.CreateMediaRequestDto;
import com.cms.maintenance.dto.MediaResponseDto;
import com.cms.maintenance.dto.UpdateMediaRequestDto;
import com.cms.maintenance.models.Media;
import com.cms.maintenance.models.Profile;

public interface MediaService {

    List<Media> getAllMedia(Profile profile);

    List<Media> getAllMediaByIds(List<UUID> ids);

    Media getMediaById(UUID id);

    Media createMedia(CreateMediaRequestDto request);

    Media updateMedia(UpdateMediaRequestDto request);

    void deleteMediaById(UUID id);

    MediaResponseDto mapToResponse(Media media);

}