package com.cms.maintenance.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cms.maintenance.models.Skill;

public interface SkillsRepository extends JpaRepository<Skill, UUID> {

    List<Skill> findAllByIdIn(List<UUID> ids);

}
