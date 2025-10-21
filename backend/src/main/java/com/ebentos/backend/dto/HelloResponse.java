package com.ebentos.backend.dto;

public class HelloResponse {
  private String message;
  private boolean status;

  public HelloResponse(String message, boolean status) {
    this.message = message;
    this.status = status;
  }

  // Getters y setters
  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public boolean isStatus() {
    return status;
  }

  public void setStatus(boolean status) {
    this.status = status;
  }
}