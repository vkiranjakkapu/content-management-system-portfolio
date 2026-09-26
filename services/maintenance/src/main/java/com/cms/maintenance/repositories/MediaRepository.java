package com.cms.maintenance.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cms.maintenance.models.Media;
import com.cms.maintenance.models.Profile;

public interface MediaRepository extends JpaRepository<Media, UUID> {

    List<Media> findAllByIdIn(List<UUID> ids);

    List<Media> findAllByProfile(Profile profile);

}
