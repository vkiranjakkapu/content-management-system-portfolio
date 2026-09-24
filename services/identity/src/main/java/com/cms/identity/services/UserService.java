package com.cms.identity.services;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

import com.cms.identity.dto.CreateUserRequestDto;
import com.cms.identity.dto.PasswordChangeRequestDto;
import com.cms.identity.dto.RegistrationRequest;
import com.cms.identity.dto.UpdateUserRequest;
import com.cms.identity.dto.UserResponse;
import com.cms.identity.entities.RoleType;

public interface UserService {
    UserResponse createUser(CreateUserRequestDto request);

    List<UserResponse> getAllUsers();

    List<UserResponse> getAllUsersByRole(RoleType role);

    List<UserResponse> getAllUsersWithIds(Collection<UUID> ids);

    UserResponse getUserById(UUID id);

    UserResponse getUserByEmail(String email);

    UserResponse register(RegistrationRequest request);

    UserResponse updateUser(UUID id, UpdateUserRequest request);

    UserResponse changePassword(PasswordChangeRequestDto request);

    void deleteUser(UUID id);
}