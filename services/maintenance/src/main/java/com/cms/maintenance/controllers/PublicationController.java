package com.cms.maintenance.controllers;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cms.maintenance.dto.ApiResponseDto;
import com.cms.maintenance.dto.UpdatePublicationRequestDto;
import com.cms.maintenance.models.Publication;
import com.cms.maintenance.services.PublicationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/cms/api/v1/publish")
@RequiredArgsConstructor
public class PublicationController {

    private final PublicationService publicationService;

    @GetMapping("/")
    public ResponseEntity<ApiResponseDto<Publication>> getPublication() {
        return ResponseEntity
                .ok(ApiResponseDto.<Publication>builder().data(publicationService.getLatestPublication()).build());
    }

    @GetMapping("/{publicationId}")
    public ResponseEntity<ApiResponseDto<Publication>> getPublicationById(@PathVariable UUID publicationId) {
        return ResponseEntity
                .ok(ApiResponseDto.<Publication>builder().data(publicationService.getPublicationById(publicationId))
                        .build());
    }

    @PostMapping("/{publicationId}")
    public ResponseEntity<Void> publishVersion(@PathVariable UUID publicationId) {
        publicationService.publishById(publicationId);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }

    @PutMapping("/")
    public ResponseEntity<ApiResponseDto<Publication>> updatePublication(
            @RequestBody UpdatePublicationRequestDto request) {
        return ResponseEntity
                .ok(ApiResponseDto.<Publication>builder().data(publicationService.updatePublication(request)).build());
    }

}
