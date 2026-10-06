package com.cms.maintenance.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cms.maintenance.dto.ApiResponseDto;
import com.cms.maintenance.dto.UpdateTechnologyRequestDto;
import com.cms.maintenance.models.Technology;
import com.cms.maintenance.services.TechnologyService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/cms/api/v1/technologies")
@RequiredArgsConstructor
public class TechnologyController {

    private final TechnologyService technologyService;

    @GetMapping("/")
    public ResponseEntity<ApiResponseDto<List<Technology>>> getAllMySkillTechnologies() {
        return ResponseEntity.ok(ApiResponseDto.<List<Technology>>builder()
                .data(technologyService.getAllTechnologies()).build());
    }

    @PutMapping("/")
    public ResponseEntity<ApiResponseDto<Technology>> updateTechnology(
            @RequestBody UpdateTechnologyRequestDto request) {
        return ResponseEntity
                .ok(ApiResponseDto.<Technology>builder().data(technologyService.updateTechnology(request))
                        .build());
    }

}
