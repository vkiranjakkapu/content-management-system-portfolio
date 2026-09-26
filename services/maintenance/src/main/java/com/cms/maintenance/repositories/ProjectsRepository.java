package com.cms.maintenance.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cms.maintenance.models.Profile;
import com.cms.maintenance.models.Project;

public interface ProjectsRepository extends JpaRepository<Project, UUID> {

    List<Project> findAllByIdIn(List<UUID> ids);

    List<Project> findAllByProfile(Profile currentUserProfile);
    
}
