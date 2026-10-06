package com.cms.maintenance.dto;

import com.cms.maintenance.enums.SkillRequestType;

import jakarta.validation.constraints.NotNull;

public record CreateSkillRequestDto(
        @NotNull SkillRequestType type,
        String tech,
        String name) {

}
