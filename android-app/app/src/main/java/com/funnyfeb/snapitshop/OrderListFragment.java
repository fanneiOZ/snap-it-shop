package com.funnyfeb.snapitshop;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

public class OrderListFragment extends Fragment {
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        RecyclerView orderRecycler = (RecyclerView) inflater.inflate(R.layout.fragment_order_list, container, false);
        String[] orderIds = {"O-001", "O-002", "O-003", "O-004", "O-005", "O-006", "O-007", "O-008", "O-009", "O-010", "O-011", "O-012", "O-013", "O-014", "O-014", "O-014", "O-014", "O-014", "O-014", "O-014"};
        OrderCardAdaptor adaptor = new OrderCardAdaptor(orderIds);
        orderRecycler.setAdapter(adaptor);
        LinearLayoutManager layoutManager = new LinearLayoutManager(getActivity());
        orderRecycler.setLayoutManager(layoutManager);

        return orderRecycler;
    }
}
