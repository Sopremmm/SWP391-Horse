package com.swp391.horseracing.entity.enums;

import java.util.Locale;

public enum RaceStatus {
    SCHEDULED,
    ONGOING,
    FINISHED,
    COMPLETED;

    public static RaceStatus fromString(String raw) {
        if (raw == null || raw.isBlank()) {
            return null;
        }
        return RaceStatus.valueOf(raw.trim().toUpperCase(Locale.ROOT));
    }
}

