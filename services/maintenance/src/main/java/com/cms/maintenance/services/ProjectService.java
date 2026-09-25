package com.cms.maintenance.services;

import java.util.List;
import java.util.UUID;

import com.cms.maintenance.dto.CreateProjectRequestDto;
import com.cms.maintenance.dto.UpdateProjectRequestDto;
import com.cms.maintenance.models.Project;

public interface ProjectService {

    Project getProjectById(UUID id);

    List<Project> getAllProjectsByIds(List<UUID> ids);
    
    Project createProject(CreateProjectRequestDto request);

    Project updateProject(UpdateProjectRequestDto request);

    boolean deleteProjectById(UUID id);

}