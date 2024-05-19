package com.example.makore.apiObjects;

public class AddContactRequestBody {
    private String username;

    public AddContactRequestBody(String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

}
