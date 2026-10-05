package com.cms.maintenance.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cms.maintenance.models.ContactRequest;

public interface ContactsRepository extends JpaRepository<ContactRequest, UUID> {

}
