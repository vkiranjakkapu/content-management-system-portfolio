package com.cms.maintenance.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cms.maintenance.models.DisplaySettings;
import com.cms.maintenance.models.Publication;

public interface SettingsRepository extends JpaRepository<DisplaySettings, UUID> {

    Optional<DisplaySettings> findByPublication(Publication publication);

}
