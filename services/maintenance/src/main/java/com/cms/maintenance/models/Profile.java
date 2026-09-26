package com.cms.maintenance.models;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "profiles")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private UUID userId;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    private Media dp;

    private String email;

    private String name;

    private String phone;

    private String designation;

    private String location;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    private Media banner;

    @OneToMany(mappedBy = "profile")
    private List<About> abouts;

    @OneToMany(mappedBy = "profile")
    private List<Project> projects;

    @OneToMany(mappedBy = "profile")
    private List<Skill> skills;

    @OneToMany(mappedBy = "profile")
    private List<Experience> experiences;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @CreationTimestamp
    private LocalDateTime createdAt;

}
