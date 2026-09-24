package com.cms.identity.services;

import com.cms.identity.dto.LoginRequestDto;
import com.cms.identity.dto.LoginResponseDto;
import com.cms.identity.dto.LogoutRequestDto;
import com.cms.identity.dto.RefreshTokenRequest;
import com.cms.identity.dto.RefreshTokenResponse;

public interface AuthenticationService {

    LoginResponseDto login(LoginRequestDto request);

    RefreshTokenResponse refresh(RefreshTokenRequest request);

    void logout(LogoutRequestDto request);

}