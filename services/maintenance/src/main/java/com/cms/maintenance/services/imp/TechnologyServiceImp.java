package com.cms.maintenance.services.imp;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.cms.maintenance.dto.UpdateTechnologyRequestDto;
import com.cms.maintenance.enums.BusinessExceptions;
import com.cms.maintenance.exceptions.BusinessException;
import com.cms.maintenance.models.Technology;
import com.cms.maintenance.repositories.TechnologyRepository;
import com.cms.maintenance.services.TechnologyService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TechnologyServiceImp implements TechnologyService {

    private final TechnologyRepository techRepository;

    @Override
    public List<Technology> getAllTechnologies() {
        return techRepository.findAllByOrderByUpdatedAtDesc();
    }

    @Override
    public Technology getTechnologyById(UUID id) {
        return techRepository.findById(id)
                .orElseThrow(() -> new BusinessException(BusinessExceptions.RESOURCE_NOT_FOUND,
                        "Technology with given Id not found."));
    }

    @Override
    public Technology createTechnology(String tech) {
        if (techRepository.findByName(tech).isPresent()) {
            throw new BusinessException(
                    BusinessExceptions.DUPLICATE_ENTRY,
                    "Technology with given name already exists.");
        }

        return techRepository.save(Technology.builder().name(tech).build());
    }

    @Override
    public Technology updateTechnology(UpdateTechnologyRequestDto request) {
        Technology technology = getTechnologyById(request.id());
        technology.setName(request.name());
        return techRepository.save(technology);
    }

    @Override
    public void deleteTechnology(UUID id) {
        techRepository.deleteById(id);
    }

}
