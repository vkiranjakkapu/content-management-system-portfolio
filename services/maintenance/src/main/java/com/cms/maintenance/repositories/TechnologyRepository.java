package com.cms.maintenance.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cms.maintenance.models.Technology;

public interface TechnologyRepository extends JpaRepository<Technology, UUID> {

    List<Technology> findAllByOrderByUpdatedAtDesc();

    Optional<Technology> findByName(String name);

}
