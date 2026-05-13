# Kirijo Native Android Plugins

This folder contains the native Kotlin classes required to supercharge the web app when running on an Android application (e.g. built using WebView, Capacitor, Cordova, etc. using GitHub Actions).

## How to use them in your Android app

If you put this web app into a mobile application using an Android WebView, you'll need to link these Kotlin files into your Android `app/src/main/java/com/kirijo/app/` folder.

### 1. `KirijoFileManager.kt`
Used for exporting directly to the `Documents/Kirijo` folder on Android and generating a notification that the file was successfully saved.
**Binding in WebView Activity:**
```kotlin
val webView: WebView = findViewById(R.id.webview)
// IMPORTANT: Add the Javascript Interfaces
webView.addJavascriptInterface(KirijoFileManager(this), "KirijoFileManager")
```
The Next.js app is already modified to check if `window.KirijoFileManager` exists and will call it instead of doing a standard web browser download.

### 2. `KirijoNotificationWorker.kt`
Used for checking how long the user has been inactive. If they haven't opened the app in a few days, it will send an "emotional" ping to bring them back.
**Scheduling from your Activity:**
```kotlin
// Using Androidx WorkManager
val request = PeriodicWorkRequestBuilder<KirijoNotificationWorker>(1, TimeUnit.DAYS)
    .setInputData(workDataOf("last_opened" to System.currentTimeMillis()))
    .build()
WorkManager.getInstance(this).enqueueUniquePeriodicWork(
    "kirijo_inactivity",
    ExistingPeriodicWorkPolicy.UPDATE,
    request
)
```

Also, remember to declare notifications and file permissions in your `AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="28" />
```
