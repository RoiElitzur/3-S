package com.example.makore.repositories;

import android.content.Context;
import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.room.Room;

import com.example.makore.AppDB;
import com.example.makore.R;
import com.example.makore.api.ChatAPI;
import com.example.makore.apiObjects.AddMessageRequestBody;
import com.example.makore.callbacks.GetChatCallBack;
import com.example.makore.dao.ChatDao;
import com.example.makore.dao.ChatDao_Impl;
import com.example.makore.dao.ChatItemDao;
import com.example.makore.entities.Chat;
import com.example.makore.entities.ChatListItem;
import com.example.makore.entities.Message;
import com.example.makore.entities.User;

import java.util.LinkedList;
import java.util.List;

public class ChatItemRepository {

    private ChatListData chatListData;

    private ChatListMessages chatListMessages;
    private AppDB db;
    private String token;

    private String username;
    private String chatId;
    private ChatDao chatDao;
    private ChatItemDao chatItemDao;
    private ChatAPI chatAPI;

    private Chat currentChat = new Chat(null, null);
    private List<Message> chatMessages;

    private List<ChatListItem> chatItemsList;

    private User contact;
    private User user;

 public ChatItemRepository(String token,Context context,String url) {
//    LocalDatabase db = LocalDatabase.getInstance();
     db = Room.databaseBuilder(context,
                     AppDB.class, "FooDB")
             .allowMainThreadQueries().build();
     chatListData = new ChatListData();
     chatAPI = new ChatAPI(url);
     chatItemDao = db.chatItemDao();
     this.token = token;

    }

    public ChatItemRepository(String token,String chatId,Context context,String username,User contact,String url) {
//    LocalDatabase db = LocalDatabase.getInstance();
        db = Room.databaseBuilder(context,
                        AppDB.class, "FooDB")
                .allowMainThreadQueries().build();
        chatAPI = new ChatAPI(url);
        chatDao =  db.chatDao();
        this.username = username;
        this.chatId = chatId;
        this.token = token;
        this.contact = contact;
        chatListMessages = new ChatListMessages();
    }
    public void setChatApi(String url){
        this.chatAPI = new ChatAPI(url);
    }

    class ChatListMessages extends MutableLiveData<List<Message>> {
        public ChatListMessages() {
            super();
        }

        @Override
        protected void onActive() {
            super.onActive();
            //from Dao
            Chat stam = new Chat(null, null);
            currentChat = chatDao.get(chatId);

            if (currentChat != null) {
                chatMessages = new LinkedList<>();
                for (int i = 0; i < currentChat.getMessages().length; i++) {
                    chatMessages.add(currentChat.getMessages()[i]);
                }
                chatListMessages.setValue(chatMessages);
            } else {
                currentChat = new Chat(null, null);
            }
            new Thread(() -> {
                chatAPI.getChat(chatListMessages, token, chatId, chatDao, currentChat);
            }).start();
        }

    }


    class ChatListData extends MutableLiveData<List<ChatListItem>> {
    public ChatListData() {
        super();
    }
             @Override
             protected void onActive() {

                 chatItemsList = chatItemDao.index();
                 chatListData.setValue(chatItemsList);
                 super.onActive();
                 new Thread(() ->{
                     chatAPI.getChatsbyUsername(chatListData, token,chatItemDao);
                 }).start();
             }
 }

    public LiveData<List<ChatListItem>> getAll() {
        return chatListData;
    }

    public LiveData<List<Message>> getMessages() {
        return chatListMessages;
    }

    public void addMessage(AddMessageRequestBody requestBody) {
        new Thread(() -> {
            chatAPI.addMessage(chatListMessages, token, chatId, requestBody, chatDao, currentChat, this.username, contact);
        }).start();

    }

    //    public void addChatItem(final ChatListItem chatItem) {
//            api.addChat(chatItem);
//        }
//
//       public void delete(final ChatListItem chatItem) {
//            api.delete(chatItem);
//     }
//
    public void reload(String msgName , int type) {
        if(type == 1) {
            chatAPI.getChatsbyUsername(chatListData, token, chatItemDao);
        } else {
            if (contact.getUsername().equals(msgName)) {
                chatAPI.getChat(chatListMessages, token, chatId, chatDao, currentChat);
            }
        }
    }


    public void deleteAllChats() {
        chatDao.deleteAllChats();
    }

    public void getChatForPicture(String token, String chatId, String username, MutableLiveData<String> otherUserPicture) {
        chatAPI.getChatForPicture(token, chatId, username, otherUserPicture);
    }
}

