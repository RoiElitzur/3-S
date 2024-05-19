package com.example.makore;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.widget.TextView;

public class MainActivity extends AppCompatActivity {
    private String token;
    private String username;
    private int view = 0;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        TextView url =findViewById(R.id.url);
        url.setText("http://10.0.2.2:12345");
        SharedViewSingleton.getInstance().setSharedTextView(url);
        Intent intent = new Intent(this, LoginActivity.class);
        startActivity(intent);
        finish();

    }
}


