package com.cms.maintenance.models;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "seo_settings")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class SeoSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "seo")
    private Publication publication;

    private String title;

    private String description;

    private String canonicalUrl;

    private String ogTitle;

    private String ogDescription;

    private UUID ogImageId;

    @Builder.Default
    private String robots = "index,follow";

}