package com.example.makore;

import android.widget.TextView;

public class SharedViewSingleton {
    private static SharedViewSingleton instance;
    private TextView sharedTextView;

    private SharedViewSingleton() {
        // Private constructor to prevent external instantiation
    }

    public static SharedViewSingleton getInstance() {
        if (instance == null) {
            instance = new SharedViewSingleton();
        }
        return instance;
    }

    public void setSharedTextView(TextView textView) {
        sharedTextView = textView;
    }
    public void setSharedUrl(String url) {
        sharedTextView.setText(url);
    }
    public TextView getSharedTextView() {
        return sharedTextView;
    }
}
