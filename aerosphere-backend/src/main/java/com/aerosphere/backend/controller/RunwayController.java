package com.aerosphere.backend.controller;

import com.aerosphere.backend.entity.Runway;
import com.aerosphere.backend.repository.RunwayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/runways")
@RequiredArgsConstructor
public class RunwayController {

    private final RunwayRepository runwayRepository;

    @GetMapping
    public List<Runway> getAll() {
        return runwayRepository.findAll();
    }
}
