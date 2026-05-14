package com.kirijo.app

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webview)
        
        // Enable Local Storage & Javascript
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true

        // 🟢 THIS MAKES THE EXPORT BUTTON WORK: Bind the Kotlin interface to Javascript
        webView.addJavascriptInterface(KirijoFileManager(this), "KirijoFileManager")

        webView.webViewClient = WebViewClient()
        webView.loadUrl("YOUR_APP_URL_OR_ASSETS_PATH_HERE") 
    }

    // 🟢 LISTEN FOR THE SAVE DIALOG: When the user picks a folder, save the data!
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        
        if (requestCode == 1001 && resultCode == Activity.RESULT_OK) {
            data?.data?.let { uri ->
                try {
                    // Write the JSON string to the file
                    contentResolver.openOutputStream(uri)?.use { outputStream ->
                        outputStream.write(KirijoFileManager.pendingDataToExport.toByteArray())
                    }
                    Toast.makeText(this, "Wishes exported successfully!", Toast.LENGTH_LONG).show()
                } catch (e: Exception) {
                    e.printStackTrace()
                    Toast.makeText(this, "Failed to save file", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }
    
    // Allow the android 'Back' button to navigate the website instead of instantly closing the app
    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
