package com.cms.maintenance.dto;

import jakarta.validation.constraints.NotEmpty;

public record CreateAboutRequestDto(
        @NotEmpty String name,
        @NotEmpty String summary) {

}
