package com.funnyfeb.snapitshop.auth;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import android.os.Bundle;

import com.funnyfeb.snapitshop.R;

public class RegisterUserActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_auth_register);
        setSupportActionBar((Toolbar) findViewById(R.id.signup_toolbar));
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
    }
}