package com.ebentos.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.ebentos.backend.dto.HelloResponse;

@RestController
@RequestMapping("/api")
public class HelloController {

  @GetMapping("/hello")
  public HelloResponse hello() {
    return new HelloResponse("Backend E-Bentos está funcionando", true);
  }
}