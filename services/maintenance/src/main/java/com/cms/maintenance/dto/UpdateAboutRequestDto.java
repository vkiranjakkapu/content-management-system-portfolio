package com.cms.maintenance.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record UpdateAboutRequestDto(
        @NotNull UUID aboutId,
        @NotEmpty String name,
        @NotEmpty String summary) {

}
