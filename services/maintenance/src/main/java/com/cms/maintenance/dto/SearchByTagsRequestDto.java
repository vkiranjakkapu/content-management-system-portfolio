package com.cms.maintenance.dto;

import java.util.List;

import com.cms.maintenance.enums.MediaTag;

import jakarta.validation.constraints.NotEmpty;

public record SearchByTagsRequestDto(@NotEmpty(message = "Empty list not allowed.") List<MediaTag> tags) {

}
