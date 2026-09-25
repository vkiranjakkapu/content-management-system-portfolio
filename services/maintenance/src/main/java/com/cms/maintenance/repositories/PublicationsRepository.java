package com.cms.maintenance.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cms.maintenance.models.Profile;
import com.cms.maintenance.models.Publication;

public interface PublicationsRepository extends JpaRepository<Publication, UUID> {

    Optional<Publication> findByProfileAndIsActiveTrue(Profile currentUserProfile);

}
