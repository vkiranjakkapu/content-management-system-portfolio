package com.cms.maintenance.dto;

import java.util.UUID;

public record UpdateSkillRequestDto(
		UUID id,
		String tech,
		String name) {

}
