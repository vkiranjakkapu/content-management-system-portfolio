package com.cms.maintenance.services.imp;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.cms.maintenance.dto.CreateContactRequestDto;
import com.cms.maintenance.enums.BusinessExceptions;
import com.cms.maintenance.exceptions.BusinessException;
import com.cms.maintenance.models.ContactRequest;
import com.cms.maintenance.repositories.ContactsRepository;
import com.cms.maintenance.services.ContactService;
import com.cms.maintenance.services.ProfileService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContactServiceImp implements ContactService {

    private final ContactsRepository contactsRepository;
    private final ProfileService profileService;

    @Override
    public ContactRequest getContactById(UUID contactId) {
        return contactsRepository.findById(contactId)
                .orElseThrow(() -> new BusinessException(BusinessExceptions.RESOURCE_NOT_FOUND,
                        "No contact request found with given Id."));
    }

    @Override
    public List<ContactRequest> getAllContactRequests() {
        return contactsRepository.findAllByProfile(profileService.getCurrentUserProfile());
    }

    @Override
    public ContactRequest createRequest(CreateContactRequestDto request) {
        return contactsRepository
                .save(ContactRequest.builder().name(request.name()).email(request.email()).message(request.message())
                        .profile(profileService.getCurrentUserProfile()).build());
    }

    @Override
    public void deleteContactRequest(UUID id) {
        contactsRepository.deleteById(id);
    }

}
