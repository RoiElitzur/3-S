package com.example.makore;

import androidx.appcompat.app.AppCompatActivity;
import androidx.room.Room;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.example.makore.api.ChatAPI;
import com.example.makore.apiObjects.LoginData;
import com.example.makore.apiObjects.TokenRequestBody;
import com.example.makore.callbacks.TokenCallback;
import com.example.makore.dao.ChatDao;
import com.example.makore.dao.ChatItemDao;
import com.example.makore.databinding.ActivityLoginBinding;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.InstanceIdResult;


public class LoginActivity extends AppCompatActivity {
    private ActivityLoginBinding binding;
//    private ActivityLoginBinding binding;
//    private ActivityLoginBinding binding;
    private String username;
    private String password;

    private ChatAPI  chatAPI;
    private AppDB db;
    private ChatItemDao chatItemDao ;
    private ChatDao chatDao ;
    TextView url;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        db = Room.databaseBuilder(this.getApplicationContext(),
                        AppDB.class, "FooDB")
                .allowMainThreadQueries().build();
        super.onCreate(savedInstanceState);
        binding = ActivityLoginBinding.inflate(getLayoutInflater());

        url = SharedViewSingleton.getInstance().getSharedTextView();
        chatAPI = new ChatAPI(url.getText().toString());
        setContentView(binding.getRoot());
        handleLogin();
        handleRegister();
        handleSettings();
    }

    private void handleLogin() {
        binding.btnLogin.setOnClickListener(view -> {

            username = binding.etLoginUsername.getText().toString();
            password = binding.etLoginPassword.getText().toString();

//            username = "yarin";
//            password = "11111111";
            chatAPI.getToken(username, password,  new TokenCallback() {
                @Override
                public void onTokenReceived(LoginData ld) {
                    if(ld.getToken() != null) {
//                        setContentView(R.layout.connecting);
                        Intent intent = new Intent(LoginActivity.this, ChatListActivity.class);
                        intent.putExtra("token", ld.getToken());
                        intent.putExtra("username", ld.getUsername());
                        startActivity(intent);
//                        finish();
                    } else {

//                        setContentView(R.layout.activity_login);
                        binding.tvLoginErrors.setText(R.string.usernameOrPassword);

                    }
                }
            });
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
//        setContentView(R.layout.activity_login);
        chatItemDao = db.chatItemDao();
        chatDao =  db.chatDao();
        chatItemDao.deleteAllChatItems();
        chatDao.deleteAllChats();
        binding.tvLoginErrors.setText("");
        binding.etLoginUsername.setText("");
        binding.etLoginPassword.setText("");
        chatAPI = new ChatAPI(url.getText().toString());
    }

    private void handleRegister(){
        binding.btnLoginRegister.setOnClickListener(view -> {
            //start registerActivity
            Intent intent = new Intent(this, RegisterActivity.class);
            startActivity(intent);
            //no need for finish because when finishing register will return to here.
        });

    }

    private void handleSettings(){
        Button btn = findViewById(R.id.btnSettings);
        btn.setOnClickListener(view -> {
            Intent intent = new Intent(this, SettingsActivity.class);
            startActivity(intent);
        });
    }
}