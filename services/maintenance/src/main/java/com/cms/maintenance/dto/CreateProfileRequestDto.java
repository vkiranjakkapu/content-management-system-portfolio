package com.cms.maintenance.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

public record CreateProfileRequestDto(
        String dp,
        @NotEmpty @Email String email,
        @NotEmpty String name,
        @NotEmpty String phone,
        @NotEmpty String designation,
        @NotEmpty String location,
        @NotEmpty String availability,
        String banner) {

}
