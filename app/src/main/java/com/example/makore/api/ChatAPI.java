package com.example.makore.api;

import android.util.Log;

import androidx.lifecycle.MutableLiveData;

import com.example.makore.R;
import com.example.makore.apiObjects.AddContactRequestBody;
import com.example.makore.apiObjects.AddMessageRequestBody;
import com.example.makore.apiObjects.FireBaseTokenPostBody;
import com.example.makore.apiObjects.LoginData;
import com.example.makore.apiObjects.RegisterRequestBody;
import com.example.makore.apiObjects.TokenRequestBody;
import com.example.makore.callbacks.AddContactCallback;
import com.example.makore.callbacks.RegisterCallBack;
import com.example.makore.callbacks.TokenCallback;
import com.example.makore.dao.ChatDao;
import com.example.makore.dao.ChatItemDao;
import com.example.makore.entities.Chat;
import com.example.makore.entities.ChatListItem;
import com.example.makore.entities.Message;
import com.example.makore.entities.User;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.Executors;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class ChatAPI {

// private MutableLiveData<List<ChatListItem>> ChatListData;
// private PostDao dao;
 Retrofit retrofit;
 WebServiceAPI webServiceAPI;

     public ChatAPI(String url) {
    //            this.ChatListData = ChatListData;
    //            this.dao = dao;
//         192.168.52.231
         retrofit = new Retrofit.Builder()
                 .baseUrl(url)
                 .callbackExecutor(Executors.newSingleThreadExecutor())
                 .addConverterFactory(GsonConverterFactory.create())
                 .build();
         webServiceAPI = retrofit.create(WebServiceAPI.class);
     }
    public void getToken(String username , String password,final TokenCallback callback) {
         TokenRequestBody requestBody = new TokenRequestBody(username, password);
         Call<ResponseBody> call = webServiceAPI.token(requestBody);
         call.enqueue(new Callback<ResponseBody>() {
             @Override
             public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                 if(response.code() == 200){
                     ResponseBody responseBody = response.body();
                     try{
                         LoginData loginData = new LoginData();
                         loginData.setToken(responseBody.string());
                         loginData.setUsername(username);
                         callback.onTokenReceived(loginData);
                     }catch (Exception e) {
                         //handle exception
                     }
                 }
                 else{
                     LoginData loginData = new LoginData();
                     callback.onTokenReceived(loginData);
                 }
             }
             @Override
             public void onFailure(Call<ResponseBody> call, Throwable t) {
                 Log.e("api", "Request failed: " + t.getMessage(), t);
             }
         });
    }

    public void getChatsbyUsername(MutableLiveData<List<ChatListItem>> chatItems,String token, ChatItemDao chatItemDao) {
        Call<List<ChatListItem>> call = webServiceAPI.getChatsbyUsername(("Bearer " + token));
        call.enqueue(new Callback<List<ChatListItem>>() {
            @Override
            public void onResponse(Call<List<ChatListItem>> call, Response<List<ChatListItem>> response) {
                chatItems.postValue(response.body());
                List<ChatListItem> chatListItems = response.body();
                if (chatListItems != null) {
                    for (ChatListItem chatListItem : chatListItems) {
                        if (chatListItem.getLstMsg() == null) {
                            // Create a new Message object and set it as the lstMsg of the ChatListItem
                            chatListItem.setlastMessage("");
                        }
                    }
                }
                chatItemDao.insert(chatListItems);
//                if(response.code() == 200){
//                    chatItems.postValue(response.body());
//                    System.out.println("SDfsdf");
//                }
            }
            @Override
            public void onFailure(Call<List<ChatListItem>> call, Throwable t) {
                Log.e("api", "Request failed: " + t.getMessage(), t);
            }
        });
    }

    public void createUser(RegisterRequestBody requestBody,  final RegisterCallBack callback){
        Call<Void> call = webServiceAPI.createUser(requestBody);
        call.enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                callback.onRegisterResponse(response.code());
            }
            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Log.e("api", "Request failed: " + t.getMessage(), t);
            }
        });
    }

    public void addContact(String username,String token,final AddContactCallback callback) {
        AddContactRequestBody requestBody = new AddContactRequestBody(username);
        Call<ResponseBody> call = webServiceAPI.createChat(("Bearer " + token), requestBody);
        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                if(response.code() == 200) {
                    callback.onAddContactResponse(response.code(), "");
                } else {
                    try{
                        ResponseBody r2 = response.errorBody();
                        callback.onAddContactResponse(response.code(), r2.string());
                    } catch (Exception e) {
                        // handle exception
                    }
                }
            }
            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Log.e("api", "Request failed: " + t.getMessage(), t);
            }
        });
    }

    public void getChat(MutableLiveData<List<Message>> chatListMessages, String token, String chatId, ChatDao chatDao,Chat currentChat){
        Call<Chat> call = webServiceAPI.getChatById(("Bearer " + token),chatId);
        call.enqueue(new Callback<Chat>() {
            @Override
            public void onResponse(Call<Chat> call, Response<Chat> response) {
                    Chat chat = response.body();
                    List<Message> lstMsg = new LinkedList<>();
                    for(int i = 0 ; i < chat.getMessages().length; i++){
                        lstMsg.add(chat.getMessages()[i]);
                    }
                    chatListMessages.postValue(lstMsg);
                    chat.setId(chatId);
                    chatDao.insert(chat);
                    currentChat.setUsers(chat.getUsers());
                    currentChat.setId(chatId);
            }
            @Override
            public void onFailure(Call<Chat> call, Throwable t) {
                Log.e("api", "Request failed: " + t.getMessage(), t);
            }
        });
    }


    public void getChatForPicture(String token, String chatId, String username, MutableLiveData<String> otherUserPicture){
        Call<Chat> call = webServiceAPI.getChatById(("Bearer " + token),chatId);
        call.enqueue(new Callback<Chat>() {
            @Override
            public void onResponse(Call<Chat> call, Response<Chat> response) {
                Chat chat = response.body();
                User candid = chat.getUsers()[0].getUsername().equals(username) ? chat.getUsers()[0] : chat.getUsers()[1];
                String pictureString = candid.getProfilePic();
                otherUserPicture.postValue(pictureString);
            }
            @Override
            public void onFailure(Call<Chat> call, Throwable t) {
                Log.e("api", "Request failed: " + t.getMessage(), t);
            }
        });
    }


    public void addMessage(MutableLiveData<List<Message>> chatListMessages , String token , String chatId ,
                           AddMessageRequestBody requestBody,ChatDao chatDao , Chat currentChat , String username , User contact1){
        Call<Message> call = webServiceAPI.addMessage(("Bearer " + token),chatId,requestBody);
        List<Message> lst = chatListMessages.getValue();
        call.enqueue(new Callback<Message>() {
            @Override
            public void onResponse(Call<Message> call, Response<Message> response) {
                if(response.code() == 200){
                    lst.add(response.body());
                    chatListMessages.postValue(lst);

                    int newSize = lst.size();
                    Message[] updatedMessages = new Message[newSize];
                    if(currentChat.getMessages() != null)
                    System.arraycopy(currentChat.getMessages(), 0, updatedMessages, 0, currentChat.getMessages().length);
                    User contact;
                    if(currentChat.getUsers()[0].getUsername() == username){
                        contact = currentChat.getUsers()[1];
                    }
                    else{
                        contact = currentChat.getUsers()[0];
                    }
                    updatedMessages[newSize - 1] = new Message(contact,requestBody.getMsg());
                    currentChat.setMessages(updatedMessages);
                    chatDao.insert(currentChat);
                }
            }
            @Override
            public void onFailure(Call<Message> call, Throwable t) {
                Log.e("api", "Request failed: " + t.getMessage(), t);
            }
        });

    }

    public void saveFireBaseToken(String username, String token){
        FireBaseTokenPostBody fireBaseTokenPostBody = new FireBaseTokenPostBody(username, token);
        Call<ResponseBody> call = webServiceAPI.saveFireBaseToken(fireBaseTokenPostBody);
        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
            }
            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Log.e("api", "Request failed: " + t.getMessage(), t);
            }
        });
    }

 }

