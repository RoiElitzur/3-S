package com.example.makore.typeconverters;

import androidx.room.TypeConverter;
import androidx.room.TypeConverter;

import com.example.makore.entities.User;
import com.google.gson.Gson;

public class UserTypeConverter {
        @TypeConverter
        public static User toUser(String value) {
            if (value == null) {
                return null;
            }
            return new Gson().fromJson(value, User.class);
        }

        @TypeConverter
        public static String fromUser(User user) {
            if (user == null) {
                return null;
            }
            return new Gson().toJson(user);
        }


}
