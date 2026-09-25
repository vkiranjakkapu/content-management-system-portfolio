package com.cms.maintenance.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.cms.maintenance.properties.AzureStorageProperties;
import com.cms.maintenance.properties.LocalStorageProperties;
import com.cms.maintenance.services.CurrentUserService;
import com.cms.maintenance.services.ProfileService;
import com.cms.maintenance.services.StorageService;
import com.cms.maintenance.services.imp.AzureBlobStorageService;
import com.cms.maintenance.services.imp.LocalStorageServiceImp;

@Configuration
public class StorageServiceConfig {

    @Bean
    @ConditionalOnProperty(prefix = "config.storage", name = "provider", havingValue = "local", matchIfMissing = true)
    public StorageService localStorageService(LocalStorageProperties properties, CurrentUserService currentUserService,
            ProfileService profileService) {
        return new LocalStorageServiceImp(properties, currentUserService, profileService);
    }

    @Bean
    @ConditionalOnProperty(prefix = "config.storage", name = "provider", havingValue = "azure")
    public StorageService azureStorageService(AzureStorageProperties properties) {
        return new AzureBlobStorageService(properties);
    }

}
