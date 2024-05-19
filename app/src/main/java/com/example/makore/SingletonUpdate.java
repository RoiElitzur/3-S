package com.example.makore;

import androidx.lifecycle.MutableLiveData;

public class SingletonUpdate {
    private static  MutableLiveData<String> msgFrom;

    private SingletonUpdate(){

    }

    public static synchronized MutableLiveData<String> getMsgFrom(){
        if(msgFrom == null) {
            msgFrom = new MutableLiveData<>();
        }
        return msgFrom;
    }
}
