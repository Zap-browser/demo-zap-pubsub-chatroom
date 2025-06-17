# Zap Browser Demo – FrontLabs

Welcome to the official demo site for exploring how the **Zap Browser** integrates with hostnames using protocol injections.

This demo showcases a **BTFS-powered chatroom** where users can join public rooms and communicate via decentralized pubsub messaging.

---

## 🚀 How to Use This Demo

Follow these steps to get started:

### 1. Install Zap Browser

Download and install the Zap Browser from the official link:

👉 [Zap Browser Download (coming soon)]()

After installation, go through the default setup as described on the homepage. This includes initial configuration and enabling core features required for injections to work.

---

### 2. Inject Permissions for the Demo Site

To allow the demo site to access Zap-injected features, follow these steps:

- Open the **Zap Browser**.
- Navigate to the **Injections** page.
- Add the following URL to injection permissions:


Or simply paste the following link into the "URL" input on the injection page:

👉 [Injection Object JSON](https://raw.githubusercontent.com/Zap-browser/demo-zap-pubsub-chatroom/refs/heads/main/injectionobject.json)

This grants the necessary permissions to allow pubsub and other APIs.

---

### 3. Open the Demo Page

Now head over to the demo:

👉 [Demo Chatroom](https://zap-browser.github.io/demo-zap-pubsub-chatroom)

You can now join any public topic and start chatting with other users in real time.

---

## 💬 Features of the Chatroom

- 🔗 Decentralized messaging over **BTFS pubsub**
- 🚪 Join and leave rooms by topic name
- 📡 Real-time message broadcast using btfs's injection APIs
- 🧼 Automatic suppression of echoed messages

---

## 📺 Watch the Demo

See it in action:

👉 [YouTube Demo Video: TBA]()

---

## 🧠 How It Works

When the demo domain is injected via Zap:

- Zap injects a secure wrapper (`window.btfs`) into the page context.
- This wrapper exposes pubsub methods like `pub()` and `sub()`.
- The site subscribes to a topic and publishes messages directly into BTFS's DHT using those APIs.
- A small echo suppression mechanism prevents displaying self-sent messages twice.

---

## 🔐 Security Note

Only inject domains that you trust.

Zap gives injected sites enhanced capabilities, including access to filesystem, pubsub, and possibly identity. Always verify the source before granting injection permissions.

---
