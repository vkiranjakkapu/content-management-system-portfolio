package com.cms.maintenance.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public record CreateAboutRequestDto(
        @NotEmpty @Size(max = 100) String name,
        @NotEmpty @Size(max = 1000) String summary) {

}
