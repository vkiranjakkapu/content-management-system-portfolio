package com.cms.maintenance.dto;

import java.util.List;
import java.util.UUID;

import com.cms.maintenance.models.Skill;

import lombok.Builder;

@Builder
public record ProjectResponseDto(
        UUID id,
        String title,
        List<Skill> techStack,
        List<MediaResponseDto> gallery,
        String gitUrl) {

}
