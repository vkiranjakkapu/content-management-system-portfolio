package com.cms.maintenance.dto;

import java.util.List;
import java.util.UUID;

public record FetchMediaByIDsRequest(
        List<UUID> ids) {

}
