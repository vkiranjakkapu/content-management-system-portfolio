package com.cms.maintenance.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotEmpty;

public record UpdateAboutRequestDto(
        @NotEmpty UUID aboutId,
        @NotEmpty String name,
        @NotEmpty String summary) {

}
