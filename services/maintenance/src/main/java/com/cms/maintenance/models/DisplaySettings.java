package com.cms.maintenance.models;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.UpdateTimestamp;

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
@Table(name = "page_settings")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class DisplaySettings {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, mappedBy = "settings")
    private Publication publication;

    @Builder.Default
    private boolean showSkills = true;

    @Builder.Default
    private boolean showProjects = true;

    @Builder.Default
    private boolean showExperience = true;

    @Builder.Default
    private boolean showContact = true;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

}
