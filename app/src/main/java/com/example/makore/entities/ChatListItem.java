package com.example.makore.entities;


import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.ForeignKey;
import androidx.room.PrimaryKey;

@Entity
public class ChatListItem {
    @PrimaryKey @NonNull
    private String id;

    private User user;
    private String lastMessage;

    public String getLastMessage() {
        return lastMessage;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setLastMessage(String lastMessage) {
        this.lastMessage = lastMessage;
    }

    public ChatListItem(User user, String lastMessage) {
        this.user = user;
        this.lastMessage = lastMessage;
    }

    public ChatListItem(String displayName, int picture) {
        this.user.setDisplayName(displayName);
        this.user.setProfilePic("picture");
    }

    public String getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public String getDisplayName() {
        return this.user.getDisplayName();
    }

    public void setDisplayName(String displayName) {
        this.user.setDisplayName(displayName);
    }

    public String getProfilePic() {
        return this.user.getProfilePic();
    }

    public void setPicture(String picture) {
        this.user.setProfilePic(picture);
    }

    public String getLstMsg() {
        return lastMessage;
    }

    public void setlastMessage(String lstMsg) {
        this.lastMessage = lstMsg;
    }

    public void setLstMsg(Message message){
        this.lastMessage = "";
    }
}


//    <?xml version="1.0" encoding="utf-8"?>
//<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
//        xmlns:app="http://schemas.android.com/apk/res-auto"
//        xmlns:tools="http://schemas.android.com/tools"
//        android:layout_width="match_parent"
//        android:layout_height="match_parent"
//        tools:context=".ChatListActivity">
//
//
//<com.google.android.material.appbar.AppBarLayout
//        android:layout_width="match_parent"
//        android:layout_height="wrap_content"
//        tools:ignore="MissingConstraints">
//
//<androidx.appcompat.widget.Toolbar
//        android:id="@+id/toolbar"
//        android:layout_width="match_parent"
//        android:layout_height="?attr/actionBarSize"
//        android:background="?attr/colorPrimary"
//        app:layout_scrollFlags="scroll|enterAlways"
//        app:popupTheme="@style/ThemeOverlay.AppCompat.Light" />
//
//</com.google.android.material.appbar.AppBarLayout>
//
//
//<androidx.swiperefreshlayout.widget.SwipeRefreshLayout
//        android:id="@+id/refreshLayout"
//        android:layout_width="match_parent"
//        android:layout_height="match_parent"
//        tools:layout_editor_absoluteX="-99dp"
//        tools:layout_editor_absoluteY="0dp">
//
//<androidx.recyclerview.widget.RecyclerView
//        android:id="@+id/lstChatItems"
//        android:layout_width="match_parent"
//        android:layout_height="match_parent"/>
//<!--            android:background="@android:color/darker_gray" />-->
//</androidx.swiperefreshlayout.widget.SwipeRefreshLayout>
//
//<com.google.android.material.floatingactionbutton.FloatingActionButton
//        android:id="@+id/btnAdd"
//        android:layout_width="wrap_content"
//        android:layout_height="wrap_content"
//        android:layout_marginBottom="16dp"
//        android:layout_marginEnd="16dp"
//        android:clickable="true"
//        app:layout_constraintBottom_toBottomOf="parent"
//        app:layout_constraintEnd_toEndOf="parent"
//        app:srcCompat="@android:drawable/ic_menu_add" />
//
//
//
//</androidx.constraintlayout.widget.ConstraintLayout>