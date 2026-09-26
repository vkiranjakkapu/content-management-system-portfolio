-- CMS Portfolio Database Schema - PostgreSQL

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS profiles (
    id UUID NOT NULL,
    user_id UUID,
    name VARCHAR(255),
    designation VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(255),
    location VARCHAR(255),
    created_at TIMESTAMP(6) NOT NULL,
    updated_at TIMESTAMP(6) NOT NULL,
    banner_id UUID UNIQUE,
    dp_id UUID UNIQUE,

    CONSTRAINT pk_profiles PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS images (
    id UUID NOT NULL,
    profile_id UUID,
    media_name VARCHAR(255),
    media_path VARCHAR(255),
    media_type VARCHAR(255),
    tag VARCHAR(255),
    created_at TIMESTAMP(6) NOT NULL,
    updated_at TIMESTAMP(6) NOT NULL,

    CONSTRAINT pk_images PRIMARY KEY (id),

    CONSTRAINT ck_images_tag
        CHECK (tag IN (
            'PROFILE',
            'UI',
            'BANNER',
            'ARCHITECTURE',
            'SCHEMA',
            'THUMBNAIL'
        ))
);

CREATE TABLE IF NOT EXISTS abouts (
    id UUID NOT NULL,
    profile_id UUID,
    name VARCHAR(255),
    summary VARCHAR(255),
    is_active BOOLEAN NOT NULL,
    created_at TIMESTAMP(6) NOT NULL,
    updated_at TIMESTAMP(6) NOT NULL,

    CONSTRAINT pk_abouts PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS contacts (
    id UUID NOT NULL,
    profile_id UUID,
    name VARCHAR(255),
    email VARCHAR(255),
    message VARCHAR(255),
    created_at TIMESTAMP(6) NOT NULL,

    CONSTRAINT pk_contacts PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS experiences (
    id UUID NOT NULL,
    profile_id UUID,
    company VARCHAR(255),
    position VARCHAR(255),
    start_date DATE,
    end_date DATE,
    is_working BOOLEAN NOT NULL,
    is_active BOOLEAN NOT NULL,
    created_at TIMESTAMP(6) NOT NULL,
    updated_at TIMESTAMP(6) NOT NULL,

    CONSTRAINT pk_experiences PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS skills (
    id UUID NOT NULL,
    profile_id UUID,
    name VARCHAR(255),
    tech VARCHAR(255),
    created_at TIMESTAMP(6) NOT NULL,
    updated_at TIMESTAMP(6) NOT NULL,

    CONSTRAINT pk_skills PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS projects (
    id UUID NOT NULL,
    profile_id UUID,
    title VARCHAR(255),
    git_url VARCHAR(255),
    is_active BOOLEAN NOT NULL,
    created_at TIMESTAMP(6) NOT NULL,
    updated_at TIMESTAMP(6) NOT NULL,

    CONSTRAINT pk_projects PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS page_settings (
    id UUID NOT NULL,
    show_contact BOOLEAN NOT NULL,
    show_experience BOOLEAN NOT NULL,
    show_projects BOOLEAN NOT NULL,
    show_skills BOOLEAN NOT NULL,
    updated_at TIMESTAMP(6) NOT NULL,

    CONSTRAINT pk_page_settings PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS publications (
    id UUID NOT NULL,
    profile_id UUID,
    about_id UUID UNIQUE,
    settings_id UUID UNIQUE,
    status VARCHAR(255),
    created_at TIMESTAMP(6) NOT NULL,
    updated_at TIMESTAMP(6) NOT NULL,

    CONSTRAINT pk_publications PRIMARY KEY (id),

    CONSTRAINT ck_publications_status
        CHECK (status IN (
            'DRAFT',
            'PUBLISH',
            'UN_PUBLISH'
        ))
);

CREATE TABLE IF NOT EXISTS projects_gallery (
    project_id UUID NOT NULL,
    gallery_id UUID NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS projects_tech_stack (
    project_id UUID NOT NULL,
    tech_stack_id UUID NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS publications_experiences (
    publication_id UUID NOT NULL,
    experiences_id UUID NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS publications_projects (
    publication_id UUID NOT NULL,
    projects_id UUID NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS publications_skills (
    publication_id UUID NOT NULL,
    skills_id UUID NOT NULL UNIQUE
);


-- ============================================================
-- FOREIGN KEYS
-- ============================================================

-- Profiles <-> Images is a cyclic relationship.
-- Therefore all foreign keys are added after table creation.

ALTER TABLE profiles
    ADD CONSTRAINT fk_profiles_banner
    FOREIGN KEY (banner_id)
    REFERENCES images (id);

ALTER TABLE profiles
    ADD CONSTRAINT fk_profiles_dp
    FOREIGN KEY (dp_id)
    REFERENCES images (id);

ALTER TABLE images
    ADD CONSTRAINT fk_images_profile
    FOREIGN KEY (profile_id)
    REFERENCES profiles (id);

ALTER TABLE abouts
    ADD CONSTRAINT fk_abouts_profile
    FOREIGN KEY (profile_id)
    REFERENCES profiles (id);

ALTER TABLE contacts
    ADD CONSTRAINT fk_contacts_profile
    FOREIGN KEY (profile_id)
    REFERENCES profiles (id);

ALTER TABLE experiences
    ADD CONSTRAINT fk_experiences_profile
    FOREIGN KEY (profile_id)
    REFERENCES profiles (id);

ALTER TABLE skills
    ADD CONSTRAINT fk_skills_profile
    FOREIGN KEY (profile_id)
    REFERENCES profiles (id);

ALTER TABLE projects
    ADD CONSTRAINT fk_projects_profile
    FOREIGN KEY (profile_id)
    REFERENCES profiles (id);

ALTER TABLE publications
    ADD CONSTRAINT fk_publications_about
    FOREIGN KEY (about_id)
    REFERENCES abouts (id);

ALTER TABLE publications
    ADD CONSTRAINT fk_publications_profile
    FOREIGN KEY (profile_id)
    REFERENCES profiles (id);

ALTER TABLE publications
    ADD CONSTRAINT fk_publications_settings
    FOREIGN KEY (settings_id)
    REFERENCES page_settings (id);

ALTER TABLE projects_gallery
    ADD CONSTRAINT fk_projects_gallery_project
    FOREIGN KEY (project_id)
    REFERENCES projects (id);

ALTER TABLE projects_gallery
    ADD CONSTRAINT fk_projects_gallery_image
    FOREIGN KEY (gallery_id)
    REFERENCES images (id);

ALTER TABLE projects_tech_stack
    ADD CONSTRAINT fk_projects_tech_stack_project
    FOREIGN KEY (project_id)
    REFERENCES projects (id);

ALTER TABLE projects_tech_stack
    ADD CONSTRAINT fk_projects_tech_stack_skill
    FOREIGN KEY (tech_stack_id)
    REFERENCES skills (id);

ALTER TABLE publications_experiences
    ADD CONSTRAINT fk_publications_experiences_publication
    FOREIGN KEY (publication_id)
    REFERENCES publications (id);

ALTER TABLE publications_experiences
    ADD CONSTRAINT fk_publications_experiences_experience
    FOREIGN KEY (experiences_id)
    REFERENCES experiences (id);

ALTER TABLE publications_projects
    ADD CONSTRAINT fk_publications_projects_publication
    FOREIGN KEY (publication_id)
    REFERENCES publications (id);

ALTER TABLE publications_projects
    ADD CONSTRAINT fk_publications_projects_project
    FOREIGN KEY (projects_id)
    REFERENCES projects (id);

ALTER TABLE publications_skills
    ADD CONSTRAINT fk_publications_skills_publication
    FOREIGN KEY (publication_id)
    REFERENCES publications (id);

ALTER TABLE publications_skills
    ADD CONSTRAINT fk_publications_skills_skill
    FOREIGN KEY (skills_id)
    REFERENCES skills (id);


-- ============================================================
-- INDEXES
-- ============================================================

-- Only one DRAFT and one PUBLISH publication per profile.
-- Multiple UN_PUBLISH records are allowed.

CREATE UNIQUE INDEX IF NOT EXISTS uq_publications_profile_active_status
    ON publications (profile_id, status)
    WHERE status IN ('DRAFT', 'PUBLISH');