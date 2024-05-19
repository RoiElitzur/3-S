package com.example.makore.typeconverters;

import androidx.room.TypeConverter;

import com.example.makore.entities.Chat;
import com.google.gson.Gson;

public class ChatTypeConverter {
        @TypeConverter
        public static Chat toChat(String value) {
            if (value == null) {
                return null;
            }
            return new Gson().fromJson(value, Chat.class);
        }

        @TypeConverter
        public static String fromChat(Chat chat) {
            if (chat == null) {
                return null;
            }
            return new Gson().toJson(chat);
        }

}
