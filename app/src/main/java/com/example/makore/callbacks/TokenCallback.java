package com.example.makore.callbacks;

import com.example.makore.apiObjects.LoginData;

public interface TokenCallback {
    void onTokenReceived(LoginData loginData);
}
