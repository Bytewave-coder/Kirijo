package com.kirijo.app

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.webkit.JavascriptInterface

class KirijoFileManager(private val context: Context) {
    
    companion object {
        // We temporarily store the JSON data here until the user picks a save location
        var pendingDataToExport: String = ""
    }

    @JavascriptInterface
    fun exportData(jsonData: String, fileName: String) {
        pendingDataToExport = jsonData
        
        // This triggers Android's native "Save As..." dialog
        val intent = Intent(Intent.ACTION_CREATE_DOCUMENT).apply {
            addCategory(Intent.CATEGORY_OPENABLE)
            type = "application/json"
            putExtra(Intent.EXTRA_TITLE, fileName)
        }
        
        if (context is Activity) {
            // "1001" is an ID we will listen for in MainActivity
            context.startActivityForResult(intent, 1001)
        }
    }
}
