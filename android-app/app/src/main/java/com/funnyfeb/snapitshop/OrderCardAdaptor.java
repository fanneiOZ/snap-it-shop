package com.funnyfeb.snapitshop;

import android.view.LayoutInflater;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.RecyclerView;

public class OrderCardAdaptor extends RecyclerView.Adapter<OrderCardAdaptor.ViewHolder> {
    public static class ViewHolder extends RecyclerView.ViewHolder {
        private CardView cardView;

        public ViewHolder(CardView v) {
            super(v);
            cardView = v;
        }
    }

    private String[] orderIds;

    public OrderCardAdaptor(String[] orderIds) {
        this.orderIds = orderIds;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        CardView cv = (CardView) LayoutInflater.from(parent.getContext())
                .inflate(R.layout.card_order, parent, false);
        return new ViewHolder(cv);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        CardView cardView = holder.cardView;
        TextView textView = (TextView) cardView.findViewById(R.id.card_order_id);
        textView.setText(orderIds[position]);
    }

    @Override
    public int getItemCount() {
        return this.orderIds.length;
    }
}
