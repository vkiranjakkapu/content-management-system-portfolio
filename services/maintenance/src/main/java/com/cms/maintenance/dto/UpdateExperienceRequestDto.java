package com.cms.maintenance.dto;

import java.time.LocalDate;
import java.util.UUID;

import jakarta.validation.constraints.NotEmpty;

public record UpdateExperienceRequestDto(
        @NotEmpty UUID expId,
        @NotEmpty String company,
        @NotEmpty String position,
        @NotEmpty LocalDate startDate,
        LocalDate ednDate,
        @NotEmpty boolean isWorking) {

}
