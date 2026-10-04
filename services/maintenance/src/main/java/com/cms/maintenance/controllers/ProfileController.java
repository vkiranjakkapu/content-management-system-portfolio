package com.cms.maintenance.controllers;

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
import com.cms.maintenance.dto.CreateProfileRequestDto;
import com.cms.maintenance.dto.UpdateProfileRequestDto;
import com.cms.maintenance.models.Profile;
import com.cms.maintenance.services.ProfileService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/cms/api/v1/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/")
    public ResponseEntity<ApiResponseDto<Profile>> getMyProfile() {
        return ResponseEntity.ok(ApiResponseDto.<Profile>builder()
                .data(profileService.getCurrentUserProfile()).build());
    }

    @PostMapping("/")
    public ResponseEntity<ApiResponseDto<Profile>> createProfile(
            @Valid @RequestBody CreateProfileRequestDto request) {
        return ResponseEntity.ok(ApiResponseDto.<Profile>builder()
                .data(profileService.createProfile(request)).build());
    }

    @PutMapping("/")
    public ResponseEntity<ApiResponseDto<Profile>> updateProfile(
            @Valid @RequestBody UpdateProfileRequestDto request) {
        return ResponseEntity.ok(ApiResponseDto.<Profile>builder()
                .data(profileService.updateProfile(request)).build());
    }

    @DeleteMapping("/{profileId}")
    public ResponseEntity<Void> deleteProfile(
            @PathVariable UUID profileId) {
        return ResponseEntity.noContent().build();
    }

}
