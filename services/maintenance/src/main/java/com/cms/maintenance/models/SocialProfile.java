package com.cms.maintenance.models;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import com.cms.maintenance.enums.SocialMediaType;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "social_profiles")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class SocialProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    private Profile profile;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private SocialMediaType name = SocialMediaType.LINKEDIN;

    private String url;

    @CreationTimestamp
    private LocalDateTime createdAt;

}
