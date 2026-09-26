package com.cms.maintenance.dto;

import java.util.UUID;

import lombok.Builder;

@Builder
public record ProfileResponseDto(
        UUID id,
        MediaResponseDto dp,
        String email,
        String name,
        String phone,
        String designation) {

}
