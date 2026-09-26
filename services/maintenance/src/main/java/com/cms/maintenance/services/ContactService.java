package com.cms.maintenance.services;

import java.util.List;
import java.util.UUID;

import com.cms.maintenance.dto.CreateContactRequestDto;
import com.cms.maintenance.models.ContactRequest;

public interface ContactService {

    ContactRequest getContactById(UUID contactId);

    List<ContactRequest> getAllContactRequests();

    ContactRequest createRequest(CreateContactRequestDto request);

    void deleteContactRequest(UUID id);

}