package com.example.makore.callbacks;

import com.example.makore.entities.Chat;

public interface GetChatCallBack {
    void onGetChatResponse(int status ,Chat chat);
}
