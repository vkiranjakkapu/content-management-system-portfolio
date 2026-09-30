package com.cms.maintenance.dto;

import java.util.Set;
import java.util.UUID;

public record FetchMediaByIDsRequest(
        Set<UUID> ids) {

}
