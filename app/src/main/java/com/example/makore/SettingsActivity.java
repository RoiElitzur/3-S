package com.example.makore;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;

import android.content.Intent;
import android.os.Bundle;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.TextView;

import com.example.makore.apiObjects.LoginData;
import com.example.makore.callbacks.TokenCallback;
import com.example.makore.databinding.ActivityCurrentChatBinding;
import com.example.makore.databinding.ActivitySettingsBinding;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class SettingsActivity extends AppCompatActivity {
    private ActivitySettingsBinding binding;

    private TextView url;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivitySettingsBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        url = SharedViewSingleton.getInstance().getSharedTextView();
        handleTheme();
        handleChangeUrl();
    }


    public static boolean isHttpString(String string) {
        String pattern = "^http:\\/\\/\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}:\\d{1,5}\\/?$";
        Pattern regex = Pattern.compile(pattern);
        Matcher matcher = regex.matcher(string);
        return matcher.matches();
    }
    private void handleChangeUrl(){
        binding.btnUrl.setOnClickListener(view -> {
            EditText editText = binding.etUrl;
            String newUrl = binding.etUrl.getText().toString();
            if(isHttpString(newUrl)) {
                SharedViewSingleton.getInstance().setSharedUrl(newUrl);
                TextView tvError = findViewById(R.id.tvSettingsErrors);
                tvError.setText("");
            } else {
                TextView tvError = findViewById(R.id.tvSettingsErrors);
                tvError.setText(R.string.the_url_is_not_valid);
            }

        });
    }
    private void handleTheme(){
        binding.switchBtn.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged (CompoundButton buttonView, boolean isChecked){

                // checking if the switch is turned on
                if (isChecked) {

                    // setting theme to night mode
                    AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
                    buttonView.setText(R.string.night_mode);
                }

                // if the above condition turns false
                // it means switch is turned off
                // by-default the switch will be off
                else {
                    // setting theme to light theme
                    AppCompatDelegate.setDefaultNightMode (AppCompatDelegate.MODE_NIGHT_NO);
                    buttonView.setText(R.string.light_mode);
                }
            }
        });
//        binding.switchBtn.setOnClickListener(view -> {
//
//        });
    }

}