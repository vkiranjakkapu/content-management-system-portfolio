package com.cms.maintenance.dto;

import java.util.UUID;

import com.cms.maintenance.enums.MediaTag;

import lombok.Builder;

@Builder
public record MediaResponseDto(
        UUID id,
        String mediaName,
        byte[] media,
        String mediaType,
        MediaTag tag) {

}
