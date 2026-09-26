package com.cms.maintenance.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cms.maintenance.dto.ApiResponseDto;
import com.cms.maintenance.dto.CreateExperienceRequestDto;
import com.cms.maintenance.dto.UpdateExperienceRequestDto;
import com.cms.maintenance.models.Experience;
import com.cms.maintenance.services.ExperienceService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/cms/api/v1/experience")
@RequiredArgsConstructor
public class ExperienceController {

    private final ExperienceService experienceService;

    @GetMapping("/")
    public ResponseEntity<ApiResponseDto<List<Experience>>> getMyExperience() {
        return ResponseEntity
                .ok(ApiResponseDto.<List<Experience>>builder().data(experienceService.getAllExperiences()).build());
    }

    @GetMapping("/{expId}")
    public ResponseEntity<ApiResponseDto<Experience>> getExperienceById(@PathVariable UUID expId) {
        return ResponseEntity
                .ok(ApiResponseDto.<Experience>builder().data(experienceService.getExperienceById(expId)).build());
    }

    @PostMapping("/")
    public ResponseEntity<ApiResponseDto<Experience>> createExperience(
            @RequestBody CreateExperienceRequestDto request) {
        return ResponseEntity
                .ok(ApiResponseDto.<Experience>builder().data(experienceService.createExperience(request)).build());
    }

    @PutMapping("/")
    public ResponseEntity<ApiResponseDto<Experience>> updateExperience(
            @RequestBody UpdateExperienceRequestDto request) {
        return ResponseEntity
                .ok(ApiResponseDto.<Experience>builder().data(experienceService.updateExperience(request)).build());
    }

    @DeleteMapping("/{expId}")
    public ResponseEntity<Void> deleteExperience(@PathVariable UUID expId) {
        experienceService.deleteExperience(expId);
        return ResponseEntity.noContent().build();
    }

}
