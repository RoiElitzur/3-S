package com.example.makore.apiObjects;

public class RegisterRequestBody {
    private String username;
    private String password;
    private String displayName;
    private String profilePic;

    public RegisterRequestBody(String username, String password, String displayName, String profilePic) {
        this.username = username;
        this.password = password;
        this.displayName = displayName;
        this.profilePic = profilePic;
    }

}
