package com.cms.maintenance.dto;

import com.cms.maintenance.enums.SocialMediaType;

import lombok.Builder;

@Builder
public record SocialProfileDto(
        SocialMediaType name,
        String url) {

}
