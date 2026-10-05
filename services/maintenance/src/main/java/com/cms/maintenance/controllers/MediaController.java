package com.cms.maintenance.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cms.maintenance.dto.ApiResponseDto;
import com.cms.maintenance.dto.CreateMediaRequestDto;
import com.cms.maintenance.dto.MediaResponseDto;
import com.cms.maintenance.dto.SearchByTagsRequestDto;
import com.cms.maintenance.dto.UpdateMediaRequestDto;
import com.cms.maintenance.enums.MediaTag;
import com.cms.maintenance.models.Media;
import com.cms.maintenance.services.MediaService;
import com.cms.maintenance.services.ProfileService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/cms/api/v1/media")
@RequiredArgsConstructor
public class MediaController {

	private final MediaService mediaService;
	private final ProfileService profileService;

	@GetMapping("/")
	public ResponseEntity<ApiResponseDto<List<Media>>> getAllMedia() {
		return ResponseEntity.ok(ApiResponseDto.<List<Media>>builder()
				.data(mediaService.getAllMedia(profileService.getCurrentUserProfile()))
				.build());
	}

	@GetMapping("/tag/{tag}")
	public ResponseEntity<ApiResponseDto<List<Media>>> getMediaByTag(@PathVariable MediaTag tag) {
		return ResponseEntity.ok(ApiResponseDto.<List<Media>>builder()
				.data(mediaService.getAllMediaByTag(tag, profileService.getCurrentUserProfile()))
				.build());
	}

	@PostMapping("/tag/")
	public ResponseEntity<ApiResponseDto<List<Media>>> getAllMediaByTag(
			@Valid @RequestBody SearchByTagsRequestDto requets) {
		return ResponseEntity.ok(ApiResponseDto.<List<Media>>builder()
				.data(mediaService.getAllMediaByTagIn(requets.tags(), profileService.getCurrentUserProfile()))
				.build());
	}

	@GetMapping("/{mediaId}")
	public ResponseEntity<ApiResponseDto<Media>> getMediaById(@PathVariable UUID mediaId) {
		return ResponseEntity.ok(ApiResponseDto.<Media>builder()
				.data(mediaService.getMediaById(mediaId)).build());
	}

	@PostMapping("/")
	public ResponseEntity<ApiResponseDto<MediaResponseDto>> createMedia(
			@Valid @ModelAttribute CreateMediaRequestDto request) {
		return ResponseEntity.ok(ApiResponseDto.<MediaResponseDto>builder()
				.data(mediaService.mapToResponse(
						mediaService.createMedia(request, profileService.getCurrentUserProfile()),
						true))
				.build());
	}

	@PutMapping("/")
	public ResponseEntity<ApiResponseDto<MediaResponseDto>> updateMedia(
			@Valid @RequestBody UpdateMediaRequestDto request) {
		return ResponseEntity.ok(ApiResponseDto.<MediaResponseDto>builder()
				.data(mediaService.mapToResponse(mediaService.updateMedia(request), true)).build());
	}

	@DeleteMapping("/{mediaId}")
	public ResponseEntity<Void> deleteMedia(@PathVariable UUID mediaId) {
		mediaService.deleteMediaById(mediaId);
		return ResponseEntity.noContent().build();
	}

}
