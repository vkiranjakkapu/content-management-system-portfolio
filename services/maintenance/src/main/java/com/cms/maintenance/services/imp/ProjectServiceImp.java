package com.cms.maintenance.services.imp;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.cms.maintenance.dto.CreateProjectRequestDto;
import com.cms.maintenance.dto.UpdateProjectRequestDto;
import com.cms.maintenance.enums.BusinessExceptions;
import com.cms.maintenance.exceptions.BusinessException;
import com.cms.maintenance.models.Media;
import com.cms.maintenance.models.Profile;
import com.cms.maintenance.models.Project;
import com.cms.maintenance.models.Skill;
import com.cms.maintenance.repositories.ProjectsRepository;
import com.cms.maintenance.services.MediaService;
import com.cms.maintenance.services.ProfileService;
import com.cms.maintenance.services.ProjectService;
import com.cms.maintenance.services.SkillsService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProjectServiceImp implements ProjectService {

    private final ProjectsRepository projectsRepository;
    private final ProfileService profileService;
    private final SkillsService skillsService;
    private final MediaService imageService;

    @Override
    public Project getProjectById(UUID id) {
        return projectsRepository.findById(id).orElseThrow(
                () -> new BusinessException(BusinessExceptions.RESOURCE_NOT_FOUND, "Project with given Id not found."));
    }

    @Override
    public List<Project> getAllProjectsByIds(List<UUID> ids) {
        return projectsRepository.findAllByIdIn(ids);
    }

    @Override
    public Project createProject(CreateProjectRequestDto request) {

        Profile profile = profileService.getCurrentUserProfile();

        List<Skill> techStack = skillsService.getAllSkillsByIds(request.techStack());
        List<Media> gallery = imageService.getAllMediaByIds(request.gallery());

        return projectsRepository.save(Project.builder()
                .profile(profile)
                .title(request.title())
                .techStack(techStack)
                .gallery(gallery)
                .gitUrl(request.gitUrl())
                .build());

    }

    @Override
    public Project updateProject(UpdateProjectRequestDto request) {
        Project project = getProjectById(request.id());

        Optional.of(request.title()).ifPresent(title -> project.setTitle(title));
        Optional.of(request.gitUrl()).ifPresent(gitUrl -> project.setGitUrl(gitUrl));

        Optional.of(request.techStack()).ifPresent(techStack -> {
            project.setTechStack(skillsService.getAllSkillsByIds(techStack));
        });

        Optional.ofNullable(request.gallery()).ifPresent(gallery -> {
            project.setGallery(imageService.getAllMediaByIds(gallery));
        });

        return projectsRepository.save(project);

    }

    @Override
    public boolean deleteProjectById(UUID id) {
        projectsRepository.deleteById(id);
        return true;
    }

}
