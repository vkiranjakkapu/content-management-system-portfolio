package com.cms.maintenance.properties;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.NotBlank;

@ConfigurationProperties(prefix = "config.storage.local")
@ConditionalOnProperty(prefix = "config.storage", name = "provider", havingValue = "local", matchIfMissing = true)
@Validated
public record LocalStorageProperties(@NotBlank(message = "Media base path cannot be blank!") String basePath) {

}
