package com.example.makore;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModel;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.DividerItemDecoration;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.TextView;

import com.example.makore.adapters.ChatListAdapter;
import com.example.makore.api.ChatAPI;
import com.example.makore.apiObjects.FireBaseTokenPostBody;
import com.example.makore.callbacks.GetChatCallBack;
import com.example.makore.dao.ChatItemDao;
import com.example.makore.entities.Chat;
import com.example.makore.entities.ChatListItem;
import com.example.makore.viewmodels.ChatItemViewModel;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.firebase.iid.FirebaseInstanceId;

import java.util.ArrayList;
import java.util.List;

public class ChatListActivity extends AppCompatActivity implements ChatListAdapter.OnItemClickListener{
    private static String currentUsername;
    private ChatItemViewModel viewModel;

    private MutableLiveData<String> msgFrom = SingletonUpdate.getMsgFrom();

    private String token;

    private  ChatListAdapter adapter;

    private TextView url;

    private ChatAPI chatAPI;

    public void onItemClick(ChatListItem chatListItem) {
        Intent intent = new Intent(this, CurrentChatActivity.class);
        intent.putExtra("token", token);
        intent.putExtra("chatId",chatListItem.getId());
        intent.putExtra("otherUser", chatListItem.getDisplayName());
        intent.putExtra("picture",chatListItem.getProfilePic());
        intent.putExtra("otherUsername",chatListItem.getUser().getUsername());
        intent.putExtra("username", getIntent().getStringExtra("username"));
        startActivity(intent);
    }
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chat_list);
        currentUsername = getIntent().getStringExtra("username");
        token = getIntent().getStringExtra("token");
        url = SharedViewSingleton.getInstance().getSharedTextView();
        chatAPI = new ChatAPI(url.getText().toString());
        viewModel = new ViewModelProvider(this, new ViewModelProvider.Factory() {
            @NonNull
            @Override
            public <T extends ViewModel> T create(@NonNull Class<T> modelClass) {
                if (modelClass.isAssignableFrom(ChatItemViewModel.class)) {
                    return (T) new ChatItemViewModel(token, ChatListActivity.this,url.getText().toString());
                }
                throw new IllegalArgumentException("Unknown ViewModel class: " + modelClass.getName());
            }
        }).get(ChatItemViewModel.class);


//        viewModel = new ViewModelProvider(this).get(ChatItemViewModel.class);
        RecyclerView lstChatItems = findViewById(R.id.lstChatItems);
          adapter = new ChatListAdapter(this);

        lstChatItems.setAdapter(adapter);
        lstChatItems.setLayoutManager(new LinearLayoutManager(this));
        adapter.setOnItemClickListener(this);
        DividerItemDecoration dividerItemDecoration = new DividerItemDecoration(this, LinearLayoutManager.VERTICAL);
        lstChatItems.addItemDecoration(dividerItemDecoration);
        viewModel.getChatList().observe(this, chatListItems -> {
            adapter.setChatListItems(chatListItems);
        });

        msgFrom.observe(this, msgName -> {
            viewModel.reload(msgName, 1);
        });

        handleAddContact();
        handleSettings();

        FirebaseInstanceId.getInstance().getInstanceId().addOnSuccessListener(ChatListActivity.this,
                instanceIdResult -> {
                    String fireBaseToken = instanceIdResult.getToken();
                    String username = getIntent().getStringExtra("username");
                    chatAPI.saveFireBaseToken(username, fireBaseToken);
                });
    }





    @Override
    protected void onResume() {
        super.onResume();
        viewModel.setChatApi(url.getText().toString());
    }


    public static  String getCurrentUsername() {
        return currentUsername;
    }


    private void handleAddContact(){
        FloatingActionButton btn = findViewById(R.id.btnAddContact);
        btn.setOnClickListener(view -> {
            Intent intent = new Intent(this, AddContactActivity.class);
            intent.putExtra("token", getIntent().getStringExtra("token"));
            intent.putExtra("username", getIntent().getStringExtra("username"));
            startActivity(intent);
        });

    }

    private void handleSettings(){
        Button btn = findViewById(R.id.btnSettings);
        btn.setOnClickListener(view -> {
            Intent intent = new Intent(this, SettingsActivity.class);
            startActivity(intent);
        });

    }


//    protected void onResume() {
//        super.onResume();
//        viewModel.getChatList().observe(this, chatListItems -> {
//            adapter.setChatListItems(chatListItems);
//        });

//    }

}


