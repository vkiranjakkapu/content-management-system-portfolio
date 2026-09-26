package com.cms.maintenance.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cms.maintenance.models.ContactRequest;
import com.cms.maintenance.models.Profile;

public interface ContactsRepository extends JpaRepository<ContactRequest, UUID> {

    List<ContactRequest> findAllByProfile(Profile profile);

}
