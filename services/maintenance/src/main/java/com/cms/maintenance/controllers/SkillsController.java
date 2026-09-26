package com.cms.maintenance.controllers;

import java.util.List;
import java.util.Map;
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
import com.cms.maintenance.dto.CreateSkillRequestDto;
import com.cms.maintenance.dto.UpdateSkillRequestDto;
import com.cms.maintenance.models.Skill;
import com.cms.maintenance.services.SkillsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/cms/api/v1/skills")
@RequiredArgsConstructor
public class SkillsController {

    private final SkillsService skillsService;

    @GetMapping("/")
    public ResponseEntity<ApiResponseDto<Map<String, List<Skill>>>> getAllMySkills() {
        return ResponseEntity.ok(ApiResponseDto.<Map<String, List<Skill>>>builder()
                .data(skillsService.mapToResponse(skillsService.getAllSkills())).build());
    }

    @GetMapping("/{skillId}")
    public ResponseEntity<ApiResponseDto<Skill>> getSkillById(@PathVariable UUID skillId) {
        return ResponseEntity.ok(ApiResponseDto.<Skill>builder()
                .data(skillsService.getSkillById(skillId)).build());
    }

    @PostMapping("/")
    public ResponseEntity<ApiResponseDto<Skill>> createSkill(@RequestBody CreateSkillRequestDto request) {
        return ResponseEntity.ok(ApiResponseDto.<Skill>builder()
                .data(skillsService.createSkill(request)).build());
    }

    @PutMapping("/")
    public ResponseEntity<ApiResponseDto<Skill>> updateSkill(@RequestBody UpdateSkillRequestDto request) {
        return ResponseEntity.ok(ApiResponseDto.<Skill>builder()
                .data(skillsService.updateSkill(request)).build());
    }

    @DeleteMapping("/{skillId}")
    public ResponseEntity<Void> deleteSkill(@PathVariable UUID skillId) {
        skillsService.deleteSkill(skillId);
        return ResponseEntity.noContent().build();
    }

}
