package com.cms.maintenance.enums;

import com.platform.web.exception.ErrorDefinition;

public enum BusinessExceptions implements ErrorDefinition {

    INTERNAL_COMMUNICATION_ERROR("INTERNAL_COMMUNICATION_ERROR", "BUS-5001",
            "Error connecting to the requested service."),
    PROFILE_UPDATE_FAILED("PROFILE_UPDATE_FAILED", "BUS-5002",
            "Error while updating profile details."),
    IMAGE_UPLOAD_FAILED("IMAGE_UPLOAD_FAILED", "BUS-5003",
            "Error while saving image."),

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
