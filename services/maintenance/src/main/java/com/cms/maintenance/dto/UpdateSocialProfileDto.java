package com.cms.maintenance.dto;

import java.util.UUID;

import com.cms.maintenance.enums.SocialMediaType;

import lombok.Builder;

@Builder
public record UpdateSocialProfileDto(
        UUID id,
        SocialMediaType name,
        String url) {

}
