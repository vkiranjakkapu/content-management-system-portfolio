package com.cms.identity.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cms.identity.entities.Address;

public interface AddressRepository extends JpaRepository<Address, Long> {
    
}
