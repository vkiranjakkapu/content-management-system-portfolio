package com.cms.maintenance.services;

import java.util.List;
import java.util.UUID;

import com.cms.maintenance.dto.CreateImageRequestDto;
import com.cms.maintenance.dto.UpdateImageRequestDto;
import com.cms.maintenance.models.Media;

public interface MediaService {

    List<Media> getAllMediaByIds(List<UUID> ids);

    Media getMediaById(UUID id);

    Media createMedia(CreateImageRequestDto request);

    Media updateMedia(UpdateImageRequestDto request);

    void deleteMediaById(UUID id);

}