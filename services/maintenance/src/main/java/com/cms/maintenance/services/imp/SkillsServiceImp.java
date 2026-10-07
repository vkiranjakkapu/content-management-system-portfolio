package com.cms.maintenance.services.imp;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.cms.maintenance.dto.CreateSkillRequestDto;
import com.cms.maintenance.dto.UpdateSkillRequestDto;
import com.cms.maintenance.enums.BusinessExceptions;
import com.cms.maintenance.enums.SkillRequestType;
import com.cms.maintenance.exceptions.BusinessException;
import com.cms.maintenance.exceptions.SecurityException;
import com.cms.maintenance.models.Profile;
import com.cms.maintenance.models.Skill;
import com.cms.maintenance.models.Technology;
import com.cms.maintenance.repositories.SkillsRepository;
import com.cms.maintenance.services.CurrentUserService;
import com.cms.maintenance.services.ProfileService;
import com.cms.maintenance.services.SkillsService;
import com.cms.maintenance.services.TechnologyService;
import com.platform.web.exception.SecurityExceptions;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SkillsServiceImp implements SkillsService {

    private final SkillsRepository skillsRepository;
    private final ProfileService profileService;
    private final TechnologyService technologyService;
    private final CurrentUserService currentUser;

    @Override
    public List<Skill> getAllSkills() {
        return skillsRepository.findAllByProfileOrderByNameDesc(profileService.getCurrentUserProfile());
    }

    @Override
    public Skill getSkillById(UUID id) {
        return skillsRepository.findById(id).orElseThrow(
                () -> new BusinessException(BusinessExceptions.RESOURCE_NOT_FOUND, "Skill with given Id not found."));
    }

    @Override
    public List<Skill> getAllSkillsByIds(List<UUID> ids) {
        return skillsRepository.findAllByIdInOrderByCreatedAtDesc(ids);
    }

    @Override
    public Skill createSkill(CreateSkillRequestDto request) {
        Profile profile = profileService.getCurrentUserProfile();

        if (!profile.getUserId().equals(currentUser.userId())) {
            throw new SecurityException(SecurityExceptions.FORBIDDEN_ACCESS,
                    "You are not allowed to do this operation");
        }

        Technology technology;
        if (request.type().equals(SkillRequestType.CREATE_NEW_TECH)) {
            technology = technologyService.createTechnology(request.tech());
        } else {
            technology = technologyService.getTechnologyById(UUID.fromString(request.tech()));
        }

        return skillsRepository.save(Skill.builder()
                .profile(profile)
                .tech(technology)
                .name(request.name())
                .build());
    }

    @Override
    public Skill updateSkill(UpdateSkillRequestDto request) {
        Skill skill = getSkillById(request.id());

        if (!skill.getProfile().getUserId().equals(currentUser.userId())) {
            throw new SecurityException(SecurityExceptions.FORBIDDEN_ACCESS,
                    "You are not allowed to do this operation");
        }

        skill.setName(request.name());
        skill.setTech(technologyService.getTechnologyById(request.techId()));

        return skillsRepository.save(skill);
    }

    @Override
    public void deleteSkill(UUID id) {
        skillsRepository.deleteById(id);
    }

    @Override
    public Map<String, List<Skill>> mapToResponse(List<Skill> allSkills) {
        return allSkills.stream().collect(Collectors.groupingBy(sk -> sk.getTech().getName()));
    }

}
