package com.ultrachat.app;

import android.app.Activity;
import android.os.Bundle;
import android.graphics.Color;
import android.view.Gravity;
import android.webkit.*;
import android.widget.*;
import android.net.Uri;

public class MainActivity extends Activity {
    private WebView web;
    private EditText address;
    private android.content.SharedPreferences prefs;
    private final int bg=Color.rgb(12,16,28), accent=Color.rgb(75,125,245);
    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setStatusBarColor(bg); getWindow().setNavigationBarColor(bg);
        prefs=getSharedPreferences("jcode",MODE_PRIVATE);
        LinearLayout root=new LinearLayout(this); root.setOrientation(1); root.setPadding(14,10,14,6); root.setBackgroundColor(bg);
        TextView title=new TextView(this); title.setText("JCODE WEB"); title.setTextSize(23); title.setTextColor(Color.WHITE); title.setPadding(4,8,4,12); root.addView(title);
        LinearLayout row=new LinearLayout(this); row.setGravity(Gravity.CENTER_VERTICAL);
        address=new EditText(this); address.setSingleLine(true); address.setTextColor(Color.WHITE); address.setHintTextColor(Color.LTGRAY); address.setHint("https://ваш-защищённый-адрес"); address.setPadding(10,6,10,6); address.setBackgroundColor(Color.rgb(28,36,54)); address.setText(prefs.getString("url","")); row.addView(address,new LinearLayout.LayoutParams(0,52,1));
        Button open=new Button(this); open.setText("ОТКРЫТЬ"); open.setTextColor(Color.WHITE); open.setBackgroundTintList(android.content.res.ColorStateList.valueOf(accent)); open.setOnClickListener(v->openAddress()); row.addView(open); root.addView(row);
        TextView note=new TextView(this); note.setText("Вставь HTTPS-ссылку на защищённый сервер JCODE WEB."); note.setTextColor(Color.LTGRAY); note.setTextSize(12); note.setPadding(4,8,4,10); root.addView(note);
        web=new WebView(this); web.getSettings().setJavaScriptEnabled(true); web.getSettings().setDomStorageEnabled(true); web.getSettings().setLoadsImagesAutomatically(true);
        web.setWebViewClient(new WebViewClient(){ @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest req){ Uri u=req.getUrl(); return !("https".equals(u.getScheme()) || "127.0.0.1".equals(u.getHost()) || "localhost".equals(u.getHost())); }});
        web.setWebChromeClient(new WebChromeClient()); root.addView(web,new LinearLayout.LayoutParams(-1,0,1));
        TextView footer=new TextView(this); footer.setText("JCODE WEB • Android client"); footer.setTextColor(Color.LTGRAY); footer.setTextSize(11); footer.setGravity(Gravity.CENTER); footer.setPadding(4,8,4,4); root.addView(footer);
        setContentView(root);
        String saved=prefs.getString("url",""); if(saved.isEmpty()) web.loadDataWithBaseURL(null,"<meta name='viewport' content='width=device-width,initial-scale=1'><body style='font-family:Arial;background:#10182a;color:white;padding:24px'><h2>JCODE WEB</h2><p>Вставь HTTPS-адрес своего сервера в поле выше и нажми ОТКРЫТЬ.</p><p>Это мобильный клиент. Сам сервер Jcode запускается отдельно.</p></body>","text/html","UTF-8",null); else web.loadUrl(saved);
    }
    private void openAddress(){ String u=address.getText().toString().trim(); if(u.isEmpty()){address.setError("Введи адрес сервера");return;} if(!u.startsWith("https://")&&!u.startsWith("http://127.0.0.1")&&!u.startsWith("http://localhost"))u="https://"+u; Uri uri=Uri.parse(u); if(!"https".equals(uri.getScheme())&&!"127.0.0.1".equals(uri.getHost())&&!"localhost".equals(uri.getHost())){address.setError("Требуется HTTPS");return;} prefs.edit().putString("url",u).apply();address.setText(u);web.loadUrl(u);}
    @Override public void onBackPressed(){if(web!=null&&web.canGoBack())web.goBack();else super.onBackPressed();}
    @Override protected void onDestroy(){if(web!=null)web.destroy();super.onDestroy();}
}