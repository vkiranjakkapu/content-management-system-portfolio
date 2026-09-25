package com.cms.maintenance.enums;

import com.platform.web.exception.ErrorDefinition;

public enum StorageExceptions implements ErrorDefinition {

    ILLEGAL_ARGUMENTS("ILLEGAL_ARGUMENTS", "BUS-4003", "Inputs are invalid."),
    INVALID_FILE("INVALID_FILE", "BUS-4004", "File unsupported for upload."),
    STORAGE_ERROR("STORAGE_FAILED", "BUS-4005", "Error while storing file.");

    private final String errorName;
    private final String errorCode;
    private final String errorMessage;

    StorageExceptions(String errorName,
            String errorCode,
            String errorMessage) {
        this.errorName = errorName;
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
    }

    @Override
    public String getErrorName() {
        return this.errorName;
    }

    @Override
    public String getErrorCode() {
        return this.errorCode;
    }

    @Override
    public String getErrorMessage() {
        return this.errorMessage;
    }

}