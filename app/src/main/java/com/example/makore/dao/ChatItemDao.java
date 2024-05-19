package com.example.makore.dao;

import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;
import androidx.room.Update;

import com.example.makore.entities.Chat;
import com.example.makore.entities.ChatListItem;

import java.util.List;
@Dao
public interface ChatItemDao {

        @Query("SELECT * FROM chatlistitem")
        List<ChatListItem> index();

        @Query("SELECT * FROM chatlistitem WHERE id = :id")
        ChatListItem get(int id);
        @Insert(onConflict = OnConflictStrategy.REPLACE)
        void insert(List<ChatListItem> chatitems);
        @Update
        void update(List<ChatListItem> chatitems);
        @Delete
        void delete(List<ChatListItem> chatitems);

        @Query("DELETE  FROM chatlistitem")
        void deleteAllChatItems();

}
