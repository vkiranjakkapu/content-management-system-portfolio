package com.cms.maintenance.dto;

import java.util.UUID;

import jakarta.validation.constraints.Size;

public record UpdateSeoSettingsRequestDto(

        @Size(max = 255) String title,

        @Size(max = 1000) String description,

        @Size(max = 500) String canonicalUrl,

        @Size(max = 255) String ogTitle,

        @Size(max = 1000) String ogDescription,

        UUID ogImageId,

        @Size(max = 100) String robots) {
}