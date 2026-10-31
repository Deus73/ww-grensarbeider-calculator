package nl.grenscalc.app;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.content.Intent;
import android.net.Uri;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

public class MainActivity extends Activity {
 private static final String HOME = "https://deus73.github.io/ww-grensarbeider-calculator/";
 private WebView web;
 @Override public void onCreate(Bundle state) {
  super.onCreate(state);
  web = new WebView(this);
  web.getSettings().setJavaScriptEnabled(true);
  web.getSettings().setDomStorageEnabled(true);
  web.getSettings().setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
  web.setWebViewClient(new WebViewClient() {
   @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
    Uri uri=request.getUrl();
    if("https".equals(uri.getScheme()) && "deus73.github.io".equals(uri.getHost())
       && uri.getPath()!=null && uri.getPath().startsWith("/ww-grensarbeider-calculator/")) return false;
    try { startActivity(new Intent(Intent.ACTION_VIEW,uri)); } catch(Exception ignored) {}
    return true;
   }
  });
  setContentView(web,new ViewGroup.LayoutParams(-1,-1));
  web.loadUrl(HOME);
 }
 @Override public void onBackPressed() {
  if(web!=null && web.canGoBack()) web.goBack(); else super.onBackPressed();
 }
 @Override protected void onDestroy() { if(web!=null){web.destroy();web=null;}super.onDestroy(); }
}
