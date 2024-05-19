package com.example.makore.typeconverters;

import com.example.makore.entities.User;
import com.google.gson.Gson;
import androidx.room.TypeConverter;

import com.example.makore.entities.User;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.Arrays;
import java.util.List;
public class UserArrayTypeConverter {
    @TypeConverter
    public static User[] toUserArray(String value) {
        if (value == null) {
            return null;
        }
        Gson gson = new Gson();
        Type type = new TypeToken<List<User>>() {}.getType();
        List<User> userList = gson.fromJson(value, type);
        return userList.toArray(new User[0]);
    }

    @TypeConverter
    public static String fromUserArray(User[] userArray) {
        if (userArray == null) {
            return null;
        }
        Gson gson = new Gson();
        Type type = new TypeToken<List<User>>() {}.getType();
        List<User> userList = Arrays.asList(userArray);
        return gson.toJson(userList, type);
    }
}
