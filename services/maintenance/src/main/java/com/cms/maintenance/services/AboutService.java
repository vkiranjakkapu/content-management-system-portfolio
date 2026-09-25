package com.cms.maintenance.services;

import java.util.UUID;

import com.cms.maintenance.dto.CreateAboutRequestDto;
import com.cms.maintenance.dto.UpdateAboutRequestDto;
import com.cms.maintenance.models.About;

public interface AboutService {

    About getLatestAboutByProfileId(UUID profileId);

    About getAboutById(UUID id);

    About createAbout(CreateAboutRequestDto request);

    About updateAbout(UpdateAboutRequestDto request);

    boolean deleteAboutById(UUID id);
    
}