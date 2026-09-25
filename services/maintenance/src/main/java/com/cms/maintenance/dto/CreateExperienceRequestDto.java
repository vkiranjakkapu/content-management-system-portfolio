package com.cms.maintenance.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotEmpty;

public record CreateExperienceRequestDto(
        @NotEmpty String company,
        @NotEmpty String position,
        @NotEmpty LocalDate startDate,
        LocalDate ednDate,
        @NotEmpty boolean isWorking) {

}
