package com.example.makore.viewmodels;

import android.content.Context;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;


import com.example.makore.apiObjects.AddMessageRequestBody;
import com.example.makore.entities.Chat;
import com.example.makore.entities.ChatListItem;
import com.example.makore.entities.Message;
import com.example.makore.entities.User;
import com.example.makore.repositories.ChatItemRepository;

import java.util.List;

public class ChatItemViewModel extends ViewModel {
    private ChatItemRepository mRepository;
    private LiveData<List<ChatListItem>> chatList;
    private LiveData<List<Message>> currentChatMessages;

    private Context context;
     public ChatItemViewModel(String token, Context context,String url){
         mRepository = new ChatItemRepository(token,context,url);
         chatList = mRepository.getAll();
     }
    public ChatItemViewModel(String token,String chatId,Context context,String username, User contact,String url){
        mRepository = new ChatItemRepository(token,chatId,context,username,contact,url);
        chatList = mRepository.getAll();
        currentChatMessages = mRepository.getMessages();
    }

    public LiveData<List<ChatListItem>> getChatList() {
        return chatList;
    }
    public LiveData<List<Message>> getCurrentChatMessages() {
        return currentChatMessages;
    }

    public void setChatApi(String url){
         mRepository.setChatApi(url);
    }

    public void addMessage(AddMessageRequestBody requestBody){
        mRepository.addMessage(requestBody);
    }

//    public void add(ChatListItem chatItem){
//         mRepository.add(chatItem);
//    }
//    public void delete(ChatListItem chatItem){
//        mRepository.delete(chatItem);
//    }
    public void reload(String msgName, int type){
        mRepository.reload(msgName, type);
    }

    public void getChatForPicture(String token, String chatId, String username, MutableLiveData<String> otherUserPicture) {
         mRepository.getChatForPicture(token, chatId, username, otherUserPicture);
    }
}
