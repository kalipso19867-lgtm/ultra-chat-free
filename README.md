# JCODE WEB Android
A lightweight Android WebView client for a separately deployed, password-protected JCODE WEB server.

## Build
GitHub Actions builds a debug APK on every push to main and on manual workflow dispatch. Open the Actions tab and download the artifact named `JCODE-WEB-Android-APK`.

## Connect
Install the APK, enter your JCODE WEB HTTPS address, and tap OPEN. The address is stored locally on the device.

## Security and scope
This APK is only a client. It does not contain or run the Jcode daemon, API bridge, model, or public tunnel. Deploy the server separately, use a strong password and preferably Cloudflare Access. Do not expose Jcode's API socket or raw daemon ports to the public internet.
