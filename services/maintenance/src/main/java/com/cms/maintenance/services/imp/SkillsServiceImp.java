package com.cms.maintenance.services.imp;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.cms.maintenance.dto.CreateSkillRequestDto;
import com.cms.maintenance.dto.UpdateSkillRequestDto;
import com.cms.maintenance.enums.BusinessExceptions;
import com.cms.maintenance.exceptions.BusinessException;
import com.cms.maintenance.models.Profile;
import com.cms.maintenance.models.Skill;
import com.cms.maintenance.repositories.SkillsRepository;
import com.cms.maintenance.services.ProfileService;
import com.cms.maintenance.services.SkillsService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SkillsServiceImp implements SkillsService {

    private final SkillsRepository skillsRepository;
    private final ProfileService profileService;

    @Override
    public List<Skill> getAllSkills() {
        return skillsRepository.findAllByProfile(profileService.getCurrentUserProfile());
    }

    @Override
    public Skill getSkillById(UUID id) {
        return skillsRepository.findById(id).orElseThrow(
                () -> new BusinessException(BusinessExceptions.RESOURCE_NOT_FOUND, "Skill with given Id not found."));
    }

    @Override
    public List<Skill> getAllSkillsByIds(List<UUID> ids) {
        return skillsRepository.findAllByIdIn(ids);
    }

    @Override
    public Skill createSkill(CreateSkillRequestDto request) {
        Profile profile = profileService.getCurrentUserProfile();

        return skillsRepository.save(Skill.builder()
                .profile(profile)
                .tech(request.tech())
                .name(request.name())
                .build());
    }

    @Override
    public Skill updateSkill(UpdateSkillRequestDto request) {
        Skill skill = getSkillById(request.id());
        skill.setTech(request.tech());
        skill.setName(request.name());

        return skillsRepository.save(skill);
    }

    @Override
    public void deleteSkill(UUID id) {
        skillsRepository.deleteById(id);
    }

    @Override
    public Map<String, List<Skill>> mapToResponse(List<Skill> allSkills) {
        return allSkills.stream().collect(Collectors.groupingBy(Skill::getTech));
    }

}
