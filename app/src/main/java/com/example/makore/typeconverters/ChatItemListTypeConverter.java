package com.example.makore.typeconverters;

import androidx.room.TypeConverter;

import com.example.makore.entities.ChatListItem;
import com.google.gson.Gson;

import java.util.List;

import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;

public class ChatItemListTypeConverter {
        @TypeConverter
        public static List<ChatListItem> toChatItemList(String value) {
            if (value == null) {
                return null;
            }
            Type listType = new TypeToken<List<ChatListItem>>() {}.getType();
            return new Gson().fromJson(value, listType);
        }

        @TypeConverter
        public static String fromChatItemList(List<ChatListItem> chatItemList) {
            if (chatItemList == null) {
                return null;
            }
            return new Gson().toJson(chatItemList);
        }

}
