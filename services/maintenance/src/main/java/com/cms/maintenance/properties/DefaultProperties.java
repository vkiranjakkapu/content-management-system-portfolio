package com.cms.maintenance.properties;

import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

@ConfigurationProperties(prefix = "config")
@Validated
public class DefaultProperties {

    private StorageProvider storage = new StorageProvider();
    private MediaProperties media = new MediaProperties();

    public MediaProperties getMedia() {
        return media;
    }

    public void setMedia(MediaProperties media) {
        this.media = media;
    }

    public StorageProvider getStorage() {
        return storage;
    }

    public void setStorage(StorageProvider storage) {
        this.storage = storage;
    }

    public static class MediaProperties {

        @NotEmpty(message = "Allowed extensions list cannot be empty!")
        private List<String> allowedExts = List.of("png", "jpg", "jpeg", "gif");

        public List<String> getAllowedExts() {
            return allowedExts;
        }

        public void setAllowedExts(List<String> allowedExts) {
            this.allowedExts = allowedExts;
        }
    }

    public static class StorageProvider {
        @NotBlank(message = "Storage provider must be specified!")
        private String provider = "local";

        public String getProvider() {
            return provider;
        }

        public void setProvider(String provider) {
            this.provider = provider;
        }
    }
}
