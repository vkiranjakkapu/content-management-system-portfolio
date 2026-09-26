package com.cms.maintenance.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cms.maintenance.models.About;
import com.cms.maintenance.models.Profile;

public interface AboutRepository extends JpaRepository<About, UUID> {

    Optional<About> findByProfile(Profile profile);

    Optional<About> findByProfileAndIsActiveTrue(Profile profile);

    List<About> findAllByProfile(Profile profile);

}
