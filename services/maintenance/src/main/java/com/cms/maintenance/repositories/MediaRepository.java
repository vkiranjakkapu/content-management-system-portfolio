package com.cms.maintenance.repositories;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cms.maintenance.enums.MediaTag;
import com.cms.maintenance.models.Media;
import com.cms.maintenance.models.Profile;

public interface MediaRepository extends JpaRepository<Media, UUID> {

    List<Media> findAllByIdIn(Collection<UUID> ids);

    List<Media> findAllByProfileOrderByUpdatedAtDesc(Profile profile);

    List<Media> findAllByTagAndProfileOrderByUpdatedAtDesc(MediaTag tag, Profile profile);

    List<Media> findAllByTagInAndProfileOrderByUpdatedAtDesc(List<MediaTag> tags, Profile profile);

}
