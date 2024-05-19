package com.example.makore.entities;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

import java.sql.Array;

@Entity
public class Chat {
    @PrimaryKey @NonNull
    private String id;
    private User[] users;

    public void setId(@NonNull String id) {
        this.id = id;
    }

    public void setUsers(User[] users) {
        this.users = users;
    }

    public String getId() {
        return id;
    }

    public User[] getUsers() {
        return users;
    }

    public Message[] getMessages() {
        return messages;
    }

    private Message[] messages;

    public void setMessages(Message[] messages) {
        this.messages = messages;
    }

    public Chat(User[] users, Message[] messages) {
        this.users = users;
        this.messages = messages;

    }

}
