package com.kirijo.app

import android.app.Activity
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import android.webkit.WebChromeClient
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import android.net.Uri

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webview)
        
        // 1. Configure WebView Settings
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true

        // 2. Add the JS Bridge!
        // This makes 'window.KirijoFileManager' available in the web code.
        webView.addJavascriptInterface(KirijoFileManager(this), "KirijoFileManager")
        
        // Setting a WebChromeClient is often required for modern web apps
        webView.webChromeClient = WebChromeClient()
        webView.webViewClient = WebViewClient()

        // Load the React/Next.js interface
        webView.loadUrl("https://your-app-domain.com")

        // 3. Register our BroadcastReceiver to listen for JS requests
        val filter = IntentFilter("com.kirijo.app.EXPORT_FILE_ACTION")
        // NOTE: On Android 13+ (Tiramisu), you must specify RECEIVER_NOT_EXPORTED or 
        // RECEIVER_EXPORTED. Use Context.RECEIVER_NOT_EXPORTED if possible.
        registerReceiver(exportReceiver, filter, Context.RECEIVER_NOT_EXPORTED)
    }

    // 4. Receives the signal from KirijoFileManager.kt
    private val exportReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            val exportIntent = intent.getParcelableExtra<Intent>("exportIntent")
            if (exportIntent != null) {
                // Launch the Android File Picker!
                startActivityForResult(exportIntent, KirijoFileManager.CREATE_FILE_REQUEST_CODE)
            }
        }
    }

    // 5. Handles the result when the user finishes picking a save location!
    @Deprecated("Deprecated in Java")
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == KirijoFileManager.CREATE_FILE_REQUEST_CODE && resultCode == Activity.RESULT_OK) {
            val uri: Uri? = data?.data
            if (uri != null) {
                saveDataToUri(uri)
            } else {
                Toast.makeText(this, "Save cancelled", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun saveDataToUri(uri: Uri) {
        try {
            contentResolver.openOutputStream(uri)?.use { outputStream ->
                // Write the string held in our companion object to the selected file
                outputStream.write(KirijoFileManager.pendingDataToExport.toByteArray())
            }
            Toast.makeText(this, "Wishes exported successfully!", Toast.LENGTH_LONG).show()
        } catch (e: Exception) {
            e.printStackTrace()
            Toast.makeText(this, "Export Failed: \${e.message}", Toast.LENGTH_LONG).show()
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        unregisterReceiver(exportReceiver)
    }
}
