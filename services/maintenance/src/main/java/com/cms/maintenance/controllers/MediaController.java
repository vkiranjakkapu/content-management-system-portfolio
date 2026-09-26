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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.cms.maintenance.dto.ApiResponseDto;
import com.cms.maintenance.dto.CreateMediaRequestDto;
import com.cms.maintenance.dto.MediaResponseDto;
import com.cms.maintenance.dto.UpdateMediaRequestDto;
import com.cms.maintenance.enums.MediaTag;
import com.cms.maintenance.services.MediaService;
import com.cms.maintenance.services.ProfileService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/cms/api/v1/media")
@RequiredArgsConstructor
public class MediaController {

	private final MediaService mediaService;
	private final ProfileService profileService;

	@GetMapping("/")
	public ResponseEntity<ApiResponseDto<List<MediaResponseDto>>> getMyMedia() {
		return ResponseEntity.ok(ApiResponseDto.<List<MediaResponseDto>>builder()
				.data(mediaService.getAllMedia(profileService.getCurrentUserProfile()).stream()
						.map(med -> mediaService.mapToResponse(med)).toList())
				.build());
	}

	@GetMapping("/{mediaId}")
	public ResponseEntity<ApiResponseDto<MediaResponseDto>> getMediaById(@PathVariable UUID mediaId) {
		return ResponseEntity.ok(ApiResponseDto.<MediaResponseDto>builder()
				.data(mediaService.mapToResponse(mediaService.getMediaById(mediaId))).build());
	}

	@PostMapping("/")
	public ResponseEntity<ApiResponseDto<MediaResponseDto>> createMedia(@NotEmpty @RequestParam MultipartFile file,
			@NotEmpty @RequestParam MediaTag tag) {
		return ResponseEntity.ok(ApiResponseDto.<MediaResponseDto>builder()
				.data(mediaService.mapToResponse(
						mediaService.createMedia(CreateMediaRequestDto.builder().file(file)
								.tag(tag).build())))
				.build());
	}

	@PutMapping("/")
	public ResponseEntity<ApiResponseDto<MediaResponseDto>> updateMedia(
			@Valid @RequestBody UpdateMediaRequestDto request) {
		return ResponseEntity.ok(ApiResponseDto.<MediaResponseDto>builder()
				.data(mediaService.mapToResponse(mediaService.updateMedia(request))).build());
	}

	@DeleteMapping("/{mediaId}")
	public ResponseEntity<Void> deleteMedia(@PathVariable UUID mediaId) {
		mediaService.deleteMediaById(mediaId);
		return ResponseEntity.noContent().build();
	}

}
