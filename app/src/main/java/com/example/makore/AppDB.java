package com.example.makore;
import androidx.room.Database;
import androidx.room.RoomDatabase;
import androidx.room.TypeConverters;

import com.example.makore.dao.ChatDao;
import com.example.makore.dao.ChatItemDao;
import com.example.makore.entities.Chat;
import com.example.makore.entities.ChatListItem;
import com.example.makore.entities.Message;
import com.example.makore.entities.User;
import com.example.makore.typeconverters.ChatItemListTypeConverter;
import com.example.makore.typeconverters.ChatTypeConverter;
import com.example.makore.typeconverters.DateTypeConverter;
import com.example.makore.typeconverters.MessageArrayTypeConverter;
import com.example.makore.typeconverters.MessageTypeConverter;
import com.example.makore.typeconverters.UserArrayTypeConverter;
import com.example.makore.typeconverters.UserTypeConverter;

@Database(entities = {ChatListItem.class,Chat.class, User.class, Message.class} , version = 1)
@TypeConverters({ChatTypeConverter.class, ChatItemListTypeConverter.class, MessageTypeConverter.class, UserTypeConverter.class
        ,MessageArrayTypeConverter.class, UserArrayTypeConverter.class , DateTypeConverter.class})
public abstract class AppDB extends RoomDatabase {
    public abstract ChatItemDao chatItemDao();

    public abstract ChatDao chatDao();
}
