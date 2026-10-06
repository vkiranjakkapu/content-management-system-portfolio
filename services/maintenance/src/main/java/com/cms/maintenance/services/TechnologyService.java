package com.cms.maintenance.services;

import java.util.List;
import java.util.UUID;

import com.cms.maintenance.dto.UpdateTechnologyRequestDto;
import com.cms.maintenance.models.Technology;

public interface TechnologyService {

    List<Technology> getAllTechnologies();

    Technology getTechnologyById(UUID id);

    Technology createTechnology(String tech);

    Technology updateTechnology(UpdateTechnologyRequestDto requets);

    void deleteTechnology(UUID id);

}
