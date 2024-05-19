package com.example.makore;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Base64;
import android.widget.TextView;

import com.example.makore.api.ChatAPI;
import com.example.makore.apiObjects.LoginData;
import com.example.makore.apiObjects.RegisterRequestBody;
import com.example.makore.callbacks.RegisterCallBack;
import com.example.makore.callbacks.TokenCallback;
import com.example.makore.databinding.ActivityLoginBinding;
import com.example.makore.databinding.ActivityRegisterBinding;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

public class RegisterActivity extends AppCompatActivity {
    private ActivityRegisterBinding binding;
    private static final int REQUEST_IMAGE_PICK = 1;
    private ChatAPI  chatAPI;

    private TextView url;
    private String selectPicture = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityRegisterBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        url = SharedViewSingleton.getInstance().getSharedTextView();
        chatAPI = new ChatAPI(url.getText().toString());
        handleRegister();
        handleSelectImage();
    }

    @Override
    protected void onResume() {
        super.onResume();
//        setContentView(binding.getRoot());
//        binding.tvRegisterErrors.setText("");
//        binding.etRegisterPassword.setText("");
//        binding.etRegisterUsername.setText("");
//        binding.etRegisterSamePassword.setText("");
//        binding.etRegisterDisplayName.setText("");
        chatAPI = new ChatAPI(url.getText().toString());
    }

    private void handleSelectImage() {
        binding.btnSelectImage.setOnClickListener(view -> {
            // Launch gallery picker intent
            Intent intent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
            startActivityForResult(intent, REQUEST_IMAGE_PICK);
        });
    }
    private void handleRegister(){
        binding.btnRegister.setOnClickListener(view -> {
            String userName = binding.etRegisterUsername.getText().toString();
            String password = binding.etRegisterPassword.getText().toString();
            String confirmPassword = binding.etRegisterSamePassword.getText().toString();
            String displayName = binding.etRegisterDisplayName.getText().toString();
            if (userName.isEmpty()) {
                binding.tvRegisterErrors.setText(R.string.please_insert_user_name);
                return;
            }

            if (password.length() < 8) {
                binding.tvRegisterErrors.setText(R.string.the_password_must_be_at_least_8_characters);
                return;
            }

            if (!password.equals(confirmPassword)) {
                binding.tvRegisterErrors.setText(R.string.please_confirm_the_password_again);
                return;
            }

            if (displayName.isEmpty()) {
                binding.tvRegisterErrors.setText(R.string.please_insert_display_name);
                return;
            }

            if (selectPicture.isEmpty()) {
                binding.tvRegisterErrors.setText(R.string.please_choose_a_picture);
                return;
            }

            RegisterRequestBody requestBody = new RegisterRequestBody(userName,password,displayName,selectPicture);
            chatAPI.createUser(requestBody,  new RegisterCallBack() {
                @Override
                public void onRegisterResponse(int status) {
                    binding.tvRegisterErrors.setText("");
                    if(status == 200) {
                        finish();
//                        Intent intent = new Intent(RegisterActivity.this, LoginActivity.class);
//                        startActivity(intent);
                    } else {
                        binding.tvRegisterErrors.setText(R.string.usernameOrPassword);
                    }
                }
            });
        });

    }



    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQUEST_IMAGE_PICK && resultCode == RESULT_OK && data != null) {
            // Get the selected image URI
            Uri imageUri = data.getData();

            // Convert URI to bitmap (optional)
            try {
                Bitmap bitmap = MediaStore.Images.Media.getBitmap(getContentResolver(), imageUri);
                ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                bitmap.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream);
                byte[] imageBytes = byteArrayOutputStream.toByteArray();

                String base64Image = Base64.encodeToString(imageBytes, Base64.DEFAULT);
                selectPicture = "data:image/jpeg;base64," + base64Image;

                // Use the bitmap as needed (e.g., display in ImageView)
                binding.ivSelectedImage.setImageBitmap(bitmap);

                // Store the image URI or perform any other desired action
                // You can retrieve the image from the URI later when needed
                // For example, you can upload it to a server
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}