package com.cms.maintenance.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateAboutRequestDto(
        @NotNull UUID id,
        @NotEmpty @Size(max = 100) String name,
        @NotEmpty @Size(max = 1000) String summary) {

}
