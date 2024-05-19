package com.example.makore.repositories;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.makore.R;
import com.example.makore.api.ChatAPI;
import com.example.makore.apiObjects.LoginData;
import com.example.makore.entities.ChatListItem;

import java.util.LinkedList;
import java.util.List;

public class LoginRepository {

    private LoginData loginData;
    public LoginRepository(){

        loginData = new LoginData();
    }
    class LoginInfo extends MutableLiveData<LoginData> {
        public LoginInfo() {
            super();
            loginData = new LoginData();
            setValue(loginData);
        }

        @Override
        protected void onActive() {
            super.onActive();
        }
//                 new Thread(()->{ChatListData.postValue(dao.get());}).start();
    }
//    public LiveData<LoginData> login(String username , String password) {
//       loginData =  api.getToken(username,password);
//    }
}
