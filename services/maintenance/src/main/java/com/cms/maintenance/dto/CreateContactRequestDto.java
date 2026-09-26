package com.cms.maintenance.dto;

public record CreateContactRequestDto(
        String name,
        String email,
        String message) {

}
