package com.cms.maintenance.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cms.maintenance.dto.ApiResponseDto;
import com.cms.maintenance.dto.CreateProjectRequestDto;
import com.cms.maintenance.dto.ProjectResponseDto;
import com.cms.maintenance.dto.UpdateProjectRequestDto;
import com.cms.maintenance.services.ProjectService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/cms/api/v1/projects")
@RequiredArgsConstructor
public class ProjectsController {

    private final ProjectService projectService;

    @GetMapping("/")
    public ResponseEntity<ApiResponseDto<List<ProjectResponseDto>>> getMyProjects() {
        return ResponseEntity.ok(ApiResponseDto.<List<ProjectResponseDto>>builder()
                .data(projectService.getAllProjects().stream().map(prj -> projectService.mapToResponse(prj)).toList())
                .build());
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<ApiResponseDto<ProjectResponseDto>> getProjectById(@PathVariable UUID projectId) {
        return ResponseEntity.ok(ApiResponseDto.<ProjectResponseDto>builder()
                .data(projectService.mapToResponse(projectService.getProjectById(projectId)))
                .build());
    }

    @PostMapping("/")
    public ResponseEntity<ApiResponseDto<ProjectResponseDto>> createProject(
            @RequestBody CreateProjectRequestDto request) {
        return ResponseEntity.ok(ApiResponseDto.<ProjectResponseDto>builder()
                .data(projectService.mapToResponse(projectService.createProject(request))).build());
    }

    @PutMapping("/")
    public ResponseEntity<ApiResponseDto<ProjectResponseDto>> createProject(
            @RequestBody UpdateProjectRequestDto request) {
        return ResponseEntity.ok(ApiResponseDto.<ProjectResponseDto>builder()
                .data(projectService.mapToResponse(projectService.updateProject(request))).build());
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<ApiResponseDto<Void>> deleteProject(@PathVariable UUID projectId) {
        projectService.deleteProjectById(projectId);
        return ResponseEntity.noContent().build();
    }

}
