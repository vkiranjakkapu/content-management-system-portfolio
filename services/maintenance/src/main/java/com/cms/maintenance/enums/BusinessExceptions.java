package com.cms.maintenance.enums;

import com.platform.web.exception.ErrorDefinition;

public enum BusinessExceptions implements ErrorDefinition {

	INTERNAL_COMMUNICATION_ERROR("INTERNAL_COMMUNICATION_ERROR", "BUS-5001",
			"Error connecting to the requested service."),
	PROFILE_UPDATE_FAILED("PROFILE_UPDATE_FAILED", "BUS-5002",
			"Error while updating profile details."),
	IMAGE_UPLOAD_FAILED("IMAGE_UPLOAD_FAILED", "BUS-5003",
			"Error while saving image."),

	PROFILE_NOT_FOUND("PROFILE_NOT_FOUND", "BUS-2001",
			"Publication not found."),
	PROFILE_ALREADY_EXISTS("PROFILE_ALREADY_EXISTS", "BUS-2002",
			"Publication not found."),

	PUBLICATION_NOT_FOUND("PUBLICATION_NOT_FOUND", "BUS-2003",
			"Publication not found."),

	DUPLICATE_ENTRY("DUPLICATE_ENTRY", "BUS-2004",
			"Entry already existed in records."),

	RESOURCE_IN_USE("RESOURCE_IN_USE", "BUS-2004",
			"Entry already existed in records."),

	RESOURCE_NOT_FOUND("RESOURCE_NOT_FOUND", "BUS-4001",
			"Resource with guven Id not found.");

	private String errorName;
	private String errorCode;
	private String errorMessage;

	private BusinessExceptions(String name, String code, String message) {
		this.errorName = name;
		this.errorCode = code;
		this.errorMessage = message;
	}

	@Override
	public String getErrorName() {
		return errorName;
	}

	@Override
	public String getErrorCode() {
		return errorCode;
	}

	@Override
	public String getErrorMessage() {
		return errorMessage;
	}
}
