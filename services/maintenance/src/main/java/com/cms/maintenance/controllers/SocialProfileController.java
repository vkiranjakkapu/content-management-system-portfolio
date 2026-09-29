package com.cms.maintenance.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cms.maintenance.dto.ApiResponseDto;
import com.cms.maintenance.dto.SocialProfileDto;
import com.cms.maintenance.dto.UpdateSocialProfileDto;
import com.cms.maintenance.models.SocialProfile;
import com.cms.maintenance.services.SocialProfileService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/cms/api/v1/socialprofile")
@RequiredArgsConstructor
public class SocialProfileController {

    private final SocialProfileService socialProfileService;

    @GetMapping("/")
    public ResponseEntity<ApiResponseDto<List<SocialProfileDto>>> getAllMySocProfiles() {
        return ResponseEntity.ok(ApiResponseDto.<List<SocialProfileDto>>builder()
                .data(socialProfileService.getAllMySocialProfiles()).build());
    }

    @PostMapping("/")
    public ResponseEntity<ApiResponseDto<SocialProfile>> createSocailProfile(@RequestBody SocialProfileDto request) {
        return ResponseEntity.ok(ApiResponseDto.<SocialProfile>builder()
                .data(socialProfileService.createSocialProfile(request)).build());
    }

    @PutMapping("/")
    public ResponseEntity<ApiResponseDto<SocialProfile>> updateSocailProfile(
            @RequestBody UpdateSocialProfileDto request) {
        return ResponseEntity.ok(ApiResponseDto.<SocialProfile>builder()
                .data(socialProfileService.updateSocialProfile(request)).build());
    }

    @GetMapping("/{spId}")
    public ResponseEntity<Void> deleteSocialProfile(@PathVariable UUID spId) {
        socialProfileService.deleteSocialProfile(spId);
        return ResponseEntity.noContent().build();
    }

}
