package com.kirijo.app

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import android.os.Environment
import android.webkit.JavascriptInterface
import android.widget.Toast
import androidx.core.app.NotificationCompat
import java.io.File
import java.io.FileOutputStream

class KirijoFileManager(private val context: Context) {

    /**
     * This method can be called directly from JavaScript within a WebView.
     * Use window.KirijoFileManager.exportData(jsonString, filename)
     */
    @JavascriptInterface
    fun exportData(jsonData: String, fileName: String) {
        try {
            // Android 10+ handles this directory smoothly. For older versions, 
            // ensure you've requested WRITE_EXTERNAL_STORAGE permission in the app layout.
            val folder = File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOCUMENTS), "Kirijo")
            if (!folder.exists()) {
                val created = folder.mkdirs()
                if (!created) {
                    throw Exception("Could not create Kirijo folder in Documents.")
                }
            }

            val file = File(folder, fileName)
            FileOutputStream(file).use {
                it.write(jsonData.toByteArray())
            }

            sendSuccessNotification(file.absolutePath)
            
            // Show toast feedback
            Toast.makeText(context, "Exported successfully to Documents/Kirijo", Toast.LENGTH_SHORT).show()

        } catch (e: Exception) {
            e.printStackTrace()
            Toast.makeText(context, "Export failed: ${e.message}", Toast.LENGTH_LONG).show()
        }
    }

    private fun sendSuccessNotification(path: String) {
        val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val channelId = "kirijo_exports"

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(channelId, "Exports", NotificationManager.IMPORTANCE_DEFAULT)
            manager.createNotificationChannel(channel)
        }

        val builder = NotificationCompat.Builder(context, channelId)
            .setSmallIcon(android.R.drawable.stat_sys_download_done)
            .setContentTitle("Kirijo Data Exported")
            .setContentText("Your wishes have been saved securely.")
            .setStyle(NotificationCompat.BigTextStyle().bigText("Data saved to folder:\n$path"))
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setAutoCancel(true)

        manager.notify(1002, builder.build())
    }
}

