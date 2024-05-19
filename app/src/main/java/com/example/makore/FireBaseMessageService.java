package com.example.makore;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.LocationManager;
import android.os.Build;
import android.os.IBinder;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.ContextCompat;
import androidx.lifecycle.MutableLiveData;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import java.util.Map;

public class FireBaseMessageService extends FirebaseMessagingService {

    private MutableLiveData<String> msgFrom = SingletonUpdate.getMsgFrom();
    public FireBaseMessageService() {
    }

    @Override
    public void onMessageReceived(@NonNull RemoteMessage remoteMessage) {
        if (remoteMessage.getNotification() != null) {
            createNotificationChannel();
            String otherUsername = "";
            String token = "";
            String chatId = "";
            String otherUser = "";
            String username = "";
            String picture = "";
            Map<String, String> data = remoteMessage.getData();
            if (data.containsKey("token")) {
                token = data.get("token");
            }
            if (data.containsKey("chatId")) {
                chatId= data.get("chatId");
            }
            if (data.containsKey("otherUser")) {
                otherUser= data.get("otherUser");
            }
            if (data.containsKey("username")) {
                username= data.get("username");
            }
            if (data.containsKey("otherUsername")) {
                otherUsername = data.get("otherUsername");
            }
            if (data.containsKey("picture")) {
                picture = data.get("picture");
            }

            msgFrom.postValue(otherUser);


            Intent intent = new Intent(this, CurrentChatActivity.class);
            intent.putExtra("token", token);
            intent.putExtra("chatId", chatId);
            intent.putExtra("otherUser", otherUser);
            intent.putExtra("username", username);
            intent.putExtra("picture", picture);
            intent.putExtra("otherUsername", otherUsername);

            PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);


            NotificationCompat.Builder builder = new NotificationCompat.Builder(this, "1")
                    .setSmallIcon(R.drawable.ic_check_icon)
                    .setContentTitle(remoteMessage.getNotification().getTitle())
                    .setContentText(remoteMessage.getNotification().getBody())
                    .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                    .setContentIntent(pendingIntent)
                    .setAutoCancel(true);

            NotificationManagerCompat notificationManagerCompat = NotificationManagerCompat.from(this);


            if (ActivityCompat.checkSelfPermission(this, android.Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                return;
            }
            String currentUsername = ChatListActivity.getCurrentUsername();
            if(!currentUsername.equals(otherUser) && currentUsername.equals(username)) {
                notificationManagerCompat.notify(1, builder.build());
            }
        }
    }

    public void createNotificationChannel(){
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            NotificationChannel channel = new NotificationChannel("1", "Makore", importance);
            channel.setDescription("Makore channel");
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }
}