# 🔔 Pushy

Pushy is a web-based tool used by the [Volunteer Live Team](https://liveteam.org) to send push notifications. It is currently in production at https://push.liveteam.org.

Pushy uses the Web Push API and the OneSignal SDK.

## Getting Started

Clone the repo and run `yarn`. To launch the site, run `yarn start` and browse to https://push-test.liveteam.org.

> Note: liveteam.org uses HSTS, so Chrome may refuse to let you connect. If this is the case, launch Chrome with this command:

`C:\path\to\chrome.exe --ignore-certificate-errors --unsafely-treat-insecure-origin-as-secure=https://push-test.liveteam.org --user-data-dir=C:\temp`

---
Pushy is created by Marks Polakovs (@markspolakovs) for the Volunteer Live Team. Licensed under the MIT License.