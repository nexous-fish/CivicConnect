# Crowdsourced Civic Issue Reporting and Resolution System (SIH)

Repository: Crowdsourced Civic Issue Reporting and Resolution System
Problem Statement: SIH (Smart India Hackathon) Civic issue reporting, tracking and resolution pipeline

A complete system to enable citizens to report civic problems (roads, sewage, drainage, street lights, waste, etc.) via web, WhatsApp (or other chat channels), and mobile; automatically collect more details via an AI call/IVR; route reports to the correct nodal officer and contractors for each city/zone; provide dashboards for citizens, nodal officers and contractors; and track issue resolution end-to-end.

## Overview

This project implements a crowdsourced civic issue reporting and resolution platform intended for municipal use and citizen participation. Citizens can report problems via web forms or WhatsApp; each report is enriched automatically (images, location, follow-up questions via an AI call/IVR), assigned to the correct nodal officer and contractor; status updates are available to reporters; and analytics / dashboards show backlog, SLAs, and contractor performance.

## Key features

### Citizen reporting via:
Web form (with image)
WhatsApp (automated parsing of messages & media)
Mobile web

### Automatic enrichment:
AI-driven call to collect missing details

### Role-based dashboards:
Citizen (track reports, add comments)
Nodal officer (city-level; assign to contractors)
Contractor (task list, upload work proofs)
Admin (manage cities, areas, users)

### Workflow and SLA management:

Issue triage, assignment, status transitions (Open → In Progress → Resolved → Closed)
Priority levels, estimated resolution time, reminders & escalations

### Notifications:

WhatsApp / SMS / Email updates to reporters and stakeholders
Audit trail and attachments (images, videos, timestamps)

### Integrations

WhatsApp Business API (Twilio WhatsApp) for incoming reports and notifications
Telephony/IVR (Twilio) for automated follow-ups / AI calls (Elevenlabs)

Optional: n8n / Zapier for low-code automations
