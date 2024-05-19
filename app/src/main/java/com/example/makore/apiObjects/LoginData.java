package com.example.makore.apiObjects;

public class LoginData {
    private String token;
    private String username;

    public LoginData() {
        this.token = null;
        this.username = null;
    }

    public String getToken() {
        return token;
    }

    public String getUsername() {
        return username;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
