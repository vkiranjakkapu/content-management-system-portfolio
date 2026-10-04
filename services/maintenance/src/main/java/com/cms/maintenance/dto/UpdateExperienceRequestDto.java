package com.cms.maintenance.dto;

import java.time.LocalDate;
import java.util.UUID;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record UpdateExperienceRequestDto(
        @NotNull UUID expId,
        @NotEmpty String company,
        @NotEmpty String position,
        @NotEmpty LocalDate startDate,
        LocalDate ednDate,
        @NotEmpty boolean isWorking) {

}
