package com.example.makore.adapters;

import android.content.Context;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.example.makore.R;
import com.example.makore.entities.ChatListItem;
import com.example.makore.entities.Message;

import java.util.List;

public class MessageListAdapter extends  RecyclerView.Adapter<MessageListAdapter.MessageListItemViewHolder>{

    private final LayoutInflater mInflater;
    private List<Message> messageListItems;
    private String username;

    class MessageListItemViewHolder extends RecyclerView.ViewHolder {
        private final TextView content;
        private final TextView date;


        private MessageListItemViewHolder(View itemView) {
            super(itemView);
            this.content = itemView.findViewById(R.id.tvMessageContent);
            this.date = itemView.findViewById(R.id.tvMessageDateTime);
        }
    }

    public MessageListAdapter(Context context, String username) {
        mInflater = LayoutInflater.from(context);
        this.username = username;
    }

    @Override
    public MessageListAdapter.MessageListItemViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View itemView;
        if(viewType == 1) {
            itemView = mInflater.inflate(R.layout.incoming_message_layout, parent, false);
        } else {
            itemView = mInflater.inflate(R.layout.outgoing_message_layout, parent, false);
        }
        MessageListAdapter.MessageListItemViewHolder viewHolder = new MessageListAdapter.MessageListItemViewHolder(itemView);
        return viewHolder;
    }


    @Override
    public void onBindViewHolder(MessageListAdapter.MessageListItemViewHolder holder, int position) {
        if(messageListItems != null) {
            final Message current = messageListItems.get(position);
            holder.content.setText(current.getContent());
            holder.date.setText(current.getCreated().toString());
//            if(current.getSender().getUsername().equals(this.username)) {
//                holder.itemView.setBackgroundColor(ContextCompat.getColor(holder.itemView.getContext(), R.color.outGoing));
//
//
//
//
//
////                RecyclerView rv = holder.itemView.findViewById(R.id.LinearLayout1);
////                LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(
////                        LinearLayout.LayoutParams.WRAP_CONTENT,
////                        LinearLayout.LayoutParams.WRAP_CONTENT
////                );
////
////                // Modify the layout parameters as needed
////                layoutParams.gravity = Gravity.END;
////
////                rv.setLayoutParams(layoutParams);
//
////                RelativeLayout.LayoutParams layoutParams = (RelativeLayout.LayoutParams) rv.getLayoutParams();
////                layoutParams.addRule(RelativeLayout.ALIGN_PARENT_END);
////                rv.setLayoutParams(layoutParams);
//
//
////                ConstraintLayout.LayoutParams layoutParams = (ConstraintLayout.LayoutParams) holder.itemView.getLayoutParams();
////                layoutParams.startToStart = ConstraintLayout.LayoutParams.UNSET;
////                layoutParams.endToEnd = ConstraintLayout.LayoutParams.PARENT_ID;
////                holder.itemView.setLayoutParams(layoutParams);
//
////                ((ConstraintLayout) holder.itemView)..
////                setGravity(Gravity.END);
////
////                ConstraintLayout.LayoutParams layoutParams = (ConstraintLayout.LayoutParams) holder.itemView.getLayoutParams();
////                layoutParams.endToEnd = ConstraintLayout.LayoutParams.PARENT_ID;
////                holder.itemView.setLayoutParams(layoutParams);
//
//
////                ((LinearLayout) holder.itemView).setGravity(Gravity.END);
//
////                LinearLayout.LayoutParams layoutParams = (LinearLayout.LayoutParams) holder.getLayoutParams();
////                layoutParams.gravity = Gravity.END;
////                holder.itemView.setLayoutParams(layoutParams);
//
////                holder.itemView.offsetLeftAndRight(0);
//            } else {
//                holder.itemView.setBackgroundColor(ContextCompat.getColor(holder.itemView.getContext(), R.color.inComing));
//
////                ConstraintLayout.LayoutParams layoutParams = (ConstraintLayout.LayoutParams) holder.itemView.getLayoutParams();
////                layoutParams.startToStart = ConstraintLayout.LayoutParams.PARENT_ID;
////                holder.itemView.setLayoutParams(layoutParams);
//
////                ((LinearLayout) holder.itemView).setGravity(Gravity.START);
////                holder.itemView.offsetLeftAndRight(100);
//            }
        }
    }
    @Override
    public int getItemViewType(int position) {
        if (messageListItems.get(position).getSender().getUsername().equals(this.username)) {
            return 1;
        } else {
            return 0;
        }
    }

    public void setMessageListItems(List<Message> c) {
        this.messageListItems = c;
        notifyDataSetChanged();
    }

    @Override
    public int getItemCount() {
        if(messageListItems != null) {
            return messageListItems.size();
        } else {
            return 0;
        }
    }

    public List<Message> getMessageListItems() {
        return messageListItems;
    }

}

//    @Override
//    public void onBindViewHolder(@NonNull MessageViewHolder holder, int position) {
//        Message message = messageList.get(position);
//
//        RelativeLayout.LayoutParams layoutParams = (RelativeLayout.LayoutParams) holder.messageLayout.getLayoutParams();
//
//        if (message.isOutgoing()) {
//            // Set layout parameters for outgoing messages (align to the left)
//            layoutParams.addRule(RelativeLayout.ALIGN_PARENT_START);
//            holder.tvMessageContent.setBackgroundResource(R.drawable.outgoing_message_background);
//        } else {
//            // Set layout parameters for incoming messages (align to the right)
//            layoutParams.addRule(RelativeLayout.ALIGN_PARENT_END);
//            holder.tvMessageContent.setBackgroundResource(R.drawable.incoming_message_background);
//        }
//
//        // Apply the updated layout parameters
//        holder.messageLayout.setLayoutParams(layoutParams);
//
//        // Bind other data to views (message content, date and time)
//        holder.tvMessageContent.setText(message.getContent());
//        holder.tvMessageDateTime.setText(message.getDateTime());
//    }