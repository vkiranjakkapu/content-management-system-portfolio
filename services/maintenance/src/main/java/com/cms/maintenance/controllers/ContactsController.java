package com.cms.maintenance.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cms.maintenance.dto.ApiResponseDto;
import com.cms.maintenance.dto.CreateContactRequestDto;
import com.cms.maintenance.models.ContactRequest;
import com.cms.maintenance.services.ContactService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/cms/api/v1/contact")
@RequiredArgsConstructor
public class ContactsController {

    private final ContactService contactService;

    @GetMapping("/")
    public ResponseEntity<ApiResponseDto<List<ContactRequest>>> getAllContactRequests() {
        return ResponseEntity.ok(
                ApiResponseDto.<List<ContactRequest>>builder().data(contactService.getAllContactRequests()).build());
    }

    @GetMapping("/{contactId}")
    public ResponseEntity<ApiResponseDto<ContactRequest>> getContactById(@PathVariable UUID contactId) {
        return ResponseEntity
                .ok(ApiResponseDto.<ContactRequest>builder().data(contactService.getContactById(contactId)).build());
    }

    @PostMapping("/")
    public ResponseEntity<ApiResponseDto<ContactRequest>> createContactRequest(
            @RequestBody CreateContactRequestDto request) {
        return ResponseEntity
                .ok(ApiResponseDto.<ContactRequest>builder().data(contactService.createRequest(request)).build());
    }

    @DeleteMapping("/{contactId}")
    public ResponseEntity<Void> deleteContactRequest(@PathVariable UUID contactId) {
        contactService.deleteContactRequest(contactId);
        return ResponseEntity.noContent().build();
    }

}
