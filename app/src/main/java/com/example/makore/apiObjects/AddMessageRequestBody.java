package com.example.makore.apiObjects;

public class AddMessageRequestBody {
    private String msg;

    public AddMessageRequestBody(String msg) {
        this.msg = msg;
    }

    public String getMsg() {
        return msg;
    }
}
