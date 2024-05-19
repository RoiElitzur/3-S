package com.example.makore.typeconverters;

import androidx.room.TypeConverter;

import com.google.gson.Gson;
import androidx.room.TypeConverter;

import com.example.makore.entities.Message;
import com.google.gson.Gson;

public class MessageTypeConverter {
        @TypeConverter
        public static Message toMessage(String value) {
            if (value == null) {
                return null;
            }
            return new Gson().fromJson(value, Message.class);
        }

        @TypeConverter
        public static String fromMessage(Message message) {
            if (message == null) {
                return null;
            }
            return new Gson().toJson(message);
        }


}
