package com.cms.maintenance.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

public record CreateContactRequestDto(
        @NotEmpty String name,
        @NotEmpty @Email String email,
        @NotEmpty String message) {

}
