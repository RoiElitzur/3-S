package com.example.makore.entities;

import androidx.annotation.NonNull;
import androidx.room.ColumnInfo;
import androidx.room.Entity;
import androidx.room.PrimaryKey;
import androidx.room.TypeConverters;

import com.example.makore.typeconverters.DateTypeConverter;

import java.util.Date;

@Entity
public class Message {
    @PrimaryKey @NonNull
    private String id;

    @TypeConverters(DateTypeConverter.class) @ColumnInfo(name = "created")
    private Date created;
    private User sender;
    private String content;


    public Message(User sender, String content) {
        this.created = new Date();
        this.sender = sender;
        this.content = content;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    public User getSender() {
        return sender;
    }

    public void setSender(User sender) {
        this.sender = sender;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
