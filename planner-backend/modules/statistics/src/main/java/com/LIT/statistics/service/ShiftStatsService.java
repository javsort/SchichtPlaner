package com.LIT.statistics.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ShiftStatsService {
    

    @Autowired
    public ShiftStatsService() {
        log.info("ShiftStatsService created");
    }
}
