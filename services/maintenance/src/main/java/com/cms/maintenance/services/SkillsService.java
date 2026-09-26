package com.cms.maintenance.services;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.cms.maintenance.dto.CreateSkillRequestDto;
import com.cms.maintenance.dto.UpdateSkillRequestDto;
import com.cms.maintenance.models.Skill;

public interface SkillsService {

    Skill getSkillById(UUID id);

    List<Skill> getAllSkills();

    List<Skill> getAllSkillsByIds(List<UUID> ids);

    Skill createSkill(CreateSkillRequestDto request);

    Skill updateSkill(UpdateSkillRequestDto request);

    void deleteSkill(UUID id);

    Map<String, List<Skill>> mapToResponse(List<Skill> allSkills);

}