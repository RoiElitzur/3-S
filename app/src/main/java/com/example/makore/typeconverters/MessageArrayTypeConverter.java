package com.example.makore.typeconverters;

import androidx.room.TypeConverter;

import com.example.makore.entities.Message;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.Arrays;
import java.util.List;

public class MessageArrayTypeConverter {
    @TypeConverter
    public static Message[] toMessageArray(String value) {
        if (value == null) {
            return null;
        }
        Gson gson = new Gson();
        Type type = new TypeToken<List<Message>>() {}.getType();
        List<Message> messageList = gson.fromJson(value, type);
        return messageList.toArray(new Message[0]);
    }

    @TypeConverter
    public static String fromMessageArray(Message[] messageArray) {
        if (messageArray == null) {
            return null;
        }
        Gson gson = new Gson();
        Type type = new TypeToken<List<Message>>() {}.getType();
        List<Message> messageList = Arrays.asList(messageArray);
        return gson.toJson(messageList, type);
    }
}
