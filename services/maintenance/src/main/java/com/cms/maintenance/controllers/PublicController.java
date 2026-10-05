package com.cms.maintenance.controllers;

import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cms.maintenance.dto.ApiResponseDto;
import com.cms.maintenance.dto.CreateContactRequestDto;
import com.cms.maintenance.dto.FetchMediaByIDsRequest;
import com.cms.maintenance.dto.MediaResponseDto;
import com.cms.maintenance.dto.PublicationResponseDto;
import com.cms.maintenance.models.ContactRequest;
import com.cms.maintenance.models.Media;
import com.cms.maintenance.services.ContactService;
import com.cms.maintenance.services.MediaService;
import com.cms.maintenance.services.PublicationService;
import com.cms.maintenance.services.StorageService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/cms/api/v1")
@RequiredArgsConstructor
public class PublicController {

	private final MediaService mediaService;
	private final StorageService storageService;
	private final PublicationService publicationService;
	private final ContactService contactService;

	@GetMapping("/publish/publication")
	public ResponseEntity<ApiResponseDto<PublicationResponseDto>> getPublication() {
		return ResponseEntity
				.ok(ApiResponseDto.<PublicationResponseDto>builder()
						.data(publicationService.mapToResponse(publicationService.getLatestPublicPublication()))
						.build());
	}

	@GetMapping("/media/fetch/{mediaId}")
	public ResponseEntity<byte[]> getMediaBytesById(@PathVariable UUID mediaId) {
		Media media = mediaService.getMediaById(mediaId);
		return ResponseEntity.ok().contentType(MediaType.parseMediaType(media.getMediaType()))
				.body(storageService.getMedia(media));
	}

	@PostMapping("/media/fetch")
	public ResponseEntity<ApiResponseDto<Map<UUID, byte[]>>> getMediaFromIds(
			@RequestBody FetchMediaByIDsRequest request) {
		return ResponseEntity.ok(ApiResponseDto.<Map<UUID, byte[]>>builder().data(
				mediaService.getAllMediaByIds(request.ids()).stream().map(med -> mediaService.mapToResponse(med, true))
						.collect(Collectors.toMap(MediaResponseDto::id, m -> m.media())))
				.build());
	}

	@PostMapping("/contact/sendquote")
	public ResponseEntity<ApiResponseDto<ContactRequest>> createContactRequest(
			@Valid @RequestBody CreateContactRequestDto request) {
		return ResponseEntity
				.ok(ApiResponseDto.<ContactRequest>builder().data(contactService.createRequest(request)).build());
	}
}
