package com.kirijo.app

import android.content.Context
import android.content.Intent
import android.webkit.JavascriptInterface

class KirijoFileManager(private val context: Context) {
    
    companion object {
        var pendingDataToExport: String = ""
        const val CREATE_FILE_REQUEST_CODE = 1001 
    }

    @JavascriptInterface
    fun exportData(jsonData: String, fileName: String) {
        pendingDataToExport = jsonData
        
        // This intent tells Android we want to create a new file
        // and open the UI picker safely!
        val intent = Intent(Intent.ACTION_CREATE_DOCUMENT).apply {
            addCategory(Intent.CATEGORY_OPENABLE)
            type = "application/json" 
            putExtra(Intent.EXTRA_TITLE, fileName)
        }
        
        // Broadcast this to MainActivity to handle the UI picker
        val broadcastIntent = Intent("com.kirijo.app.EXPORT_FILE_ACTION")
        broadcastIntent.putExtra("exportIntent", intent)
        context.sendBroadcast(broadcastIntent)
    }
}
