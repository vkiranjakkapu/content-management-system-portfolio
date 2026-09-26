package com.cms.maintenance.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cms.maintenance.models.Experience;
import com.cms.maintenance.models.Profile;

public interface ExperiencesRepository extends JpaRepository<Experience, UUID> {

    Optional<Experience> findByProfileAndIsActiveTrue(Profile profile);

    List<Experience> findAllByIdIn(List<UUID> ids);

    List<Experience> findAllByProfile(Profile currentUserProfile);

}
