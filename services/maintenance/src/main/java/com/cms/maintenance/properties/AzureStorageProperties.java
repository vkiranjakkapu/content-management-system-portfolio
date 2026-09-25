package com.cms.maintenance.properties;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.NotBlank;

@ConfigurationProperties(prefix = "config.storage.azure")
@ConditionalOnProperty(prefix = "config.storage", name = "provider", havingValue = "azure")
@Validated
public record AzureStorageProperties(
		@NotBlank(message = "Azure 'connection-string' not configured!") String connectionString,
		@NotBlank(message = "Azure 'container-name' not configured!") String containerName) {
}