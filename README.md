# 🏠 IOT Home Leave Detection (HLD)

### _Never forget something important when leaving home — again._

---

## 📖 Overview

**IOT Home Leave Detection** is a smart IoT-powered web application that detects when a user leaves their home and sends them personalized reminders about things they might forget — such as turning off the lights, shutting off the gas stove, or grabbing their house keys.

The system bridges the gap between physical IoT sensors and a modern web dashboard, giving users full visibility and control over their home status at the moment they leave.

---

## ✨ Features

- 🚪 **Leave Detection** — Automatically detects when the user exits the home via IoT event triggers
- 🔔 **Smart Reminders** — Sends contextual reminders for configurable checklist items (lights, gas, keys, etc.)
- ⚙️ **Customizable Checklists** — Users can add, edit, or remove reminder items from their personal list
- 📊 **Real-time Dashboard** — Live overview of home device states and reminder history
- 🔌 **IoT Simulation** — Device interactions simulated and managed via Node-RED flows

---

## 🛠️ Tech Stack

| Layer          | Technology             |
| -------------- | ---------------------- |
| Frontend       | Next.js + Tailwind CSS |
| Backend / DB   | Supabase (PostgreSQL)  |
| IoT Simulation | Node-RED               |
| Language       | TypeScript             |

---

## 🏗️ Architecture

```
IoT Sensors (simulated via Node-RED)
        │
        ▼
   Event Triggers
        │
        ▼
  Supabase (DB + Realtime)
        │
        ▼
  Next.js Dashboard  ◄──► User
```

When a leave event is detected by the Node-RED flow, it updates the device/event state in Supabase. The Next.js dashboard subscribes to real-time changes and immediately notifies the user with their personalized reminder list.

---

## 🎓 About

This project was developed as part of a **university Internet of Things (IoT) course**, demonstrating practical integration of smart home concepts, real-time web technologies, and IoT device simulation.
