package com.kirijo.app

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.work.Worker
import androidx.work.WorkerParameters

class KirijoNotificationWorker(appContext: Context, workerParams: WorkerParameters) :
    Worker(appContext, workerParams) {

    private val emotionalMessages = listOf(
        "We haven't seen you in a while! Your wishes are waiting.",
        "Your journal misses your thoughts. Come back soon?",
        "It's been a little lonely here. Write down a new wish today!",
        "Don't let your dreams gather dust. Open Kirijo today.",
        "A lot can change in a few days. How are your wishes doing?"
    )

    override fun doWork(): Result {
        // You would pass the last opened time in the inputData from your app
        val lastOpened = inputData.getLong("last_opened", System.currentTimeMillis())
        val daysSinceLimit = 3 * 24 * 60 * 60 * 1000L // 3 days

        if (System.currentTimeMillis() - lastOpened > daysSinceLimit) {
            sendNotification(emotionalMessages.random())
        }

        return Result.success()
    }

    private fun sendNotification(message: String) {
        val manager = applicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val channelId = "kirijo_reminders"

        // Create the NotificationChannel, but only on API 26+ because
        // the NotificationChannel class is new and not in the support library
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val name = "Emotional Reminders"
            val descriptionText = "Notifications when you haven't used the app in a while"
            val importance = NotificationManager.IMPORTANCE_DEFAULT
            val channel = NotificationChannel(channelId, name, importance).apply {
                description = descriptionText
            }
            manager.createNotificationChannel(channel)
        }

        val builder = NotificationCompat.Builder(applicationContext, channelId)
            // Replace with your actual app icon drawable
            .setSmallIcon(android.R.drawable.ic_dialog_info) 
            .setContentTitle("Kirijo Journal")
            .setContentText(message)
            .setStyle(NotificationCompat.BigTextStyle().bigText(message))
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setAutoCancel(true)

        manager.notify(1001, builder.build())
    }
}
