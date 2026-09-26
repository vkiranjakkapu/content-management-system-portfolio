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
import com.cms.maintenance.dto.CreateAboutRequestDto;
import com.cms.maintenance.dto.UpdateAboutRequestDto;
import com.cms.maintenance.models.About;
import com.cms.maintenance.services.AboutService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/cms/api/v1/about")
@RequiredArgsConstructor
public class AboutController {

    private final AboutService aboutService;

    @GetMapping("/")
    public ResponseEntity<ApiResponseDto<List<About>>> getAllAbouts() {
        return ResponseEntity.ok(ApiResponseDto.<List<About>>builder().data(aboutService.getAllAbouts()).build());
    }

    @GetMapping("/{aboutId}")
    public ResponseEntity<ApiResponseDto<About>> getAboutById(@PathVariable UUID aboutId) {
        return ResponseEntity.ok(ApiResponseDto.<About>builder().data(aboutService.getAboutById(aboutId)).build());
    }

    @PostMapping("/")
    public ResponseEntity<ApiResponseDto<About>> createAbout(@RequestBody CreateAboutRequestDto request) {
        return ResponseEntity.ok(ApiResponseDto.<About>builder().data(aboutService.createAbout(request)).build());
    }

    @PutMapping("/")
    public ResponseEntity<ApiResponseDto<About>> updateAbout(@RequestBody UpdateAboutRequestDto request) {
        return ResponseEntity.ok(ApiResponseDto.<About>builder().data(aboutService.updateAbout(request)).build());
    }

    @DeleteMapping("/{aboutId}")
    public ResponseEntity<Void> deleteAbout(@PathVariable UUID aboutId) {
        aboutService.deleteAboutById(aboutId);
        return ResponseEntity.noContent().build();
    }

}
