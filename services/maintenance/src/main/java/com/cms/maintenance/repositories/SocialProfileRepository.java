package com.cms.maintenance.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cms.maintenance.dto.SocialProfileDto;
import com.cms.maintenance.models.Profile;
import com.cms.maintenance.models.SocialProfile;

public interface SocialProfileRepository extends JpaRepository<SocialProfile, UUID> {

    List<SocialProfileDto> findByProfile(Profile currentUserProfile);

}
