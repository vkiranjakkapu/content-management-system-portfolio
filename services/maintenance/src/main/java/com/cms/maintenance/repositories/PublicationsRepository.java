package com.cms.maintenance.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cms.maintenance.enums.PublicationStatus;
import com.cms.maintenance.models.Profile;
import com.cms.maintenance.models.Publication;

public interface PublicationsRepository extends JpaRepository<Publication, UUID> {

    List<Publication> findAllByProfileOrderByUpdatedAtDesc(Profile currentUserProfile);

    Optional<Publication> findByProfileAndStatus(Profile currentUserProfile, PublicationStatus publish);

    Optional<Publication> findFirstByStatusOrderByUpdatedAtDesc(PublicationStatus status);

    Optional<Publication> findFirstByProfileAndStatusOrderByCreatedAtDesc(Profile currentUserProfile,
            PublicationStatus draft);

}
