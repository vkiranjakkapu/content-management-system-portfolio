package com.cms.identity.dto;

public record RefreshTokenResponse(
		String accessToken,
		String refreshToken) {
}
