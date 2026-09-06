# 🌍 ECO-RISK AI
## Environmental Risk Assessment & GIS-Based Decision Support System

> **An intelligent environmental site assessment platform for location-based analysis, comparative risk evaluation, and decision support.**

---

## 📌 Overview

**ECO-RISK AI** is a GIS-enabled environmental assessment and decision-support platform designed to support preliminary environmental risk evaluation for proposed development and construction sites.

The system allows users to:

- 🌍 Start an environmental assessment project
- 🏗️ Select the type of proposed development or construction
- 📍 Search and select locations across India
- 🗺️ Visualize assessment sites on an interactive GIS map
- 📊 Assess multiple environmental parameters
- 🔬 Apply different environmental assessment methodologies
- ⚖️ Compare multiple candidate sites
- 🧮 Generate weighted risk scores using MCDA
- 💡 Receive decision-support recommendations
- 📑 Review assessment progress and results

The platform is designed as a modern **Environmental GIS + Assessment + Decision Support prototype**, combining spatial exploration with structured environmental evaluation.

---

# ✨ Key Features

## 🌍 Intelligent Onboarding

The application begins with a guided project setup flow where users can define their assessment before entering the GIS workspace.

The onboarding process helps collect information such as:

- Project details
- Proposed development / construction type
- Assessment purpose
- Environmental study requirements

This provides a structured starting point for the environmental assessment workflow.

---

## 📍 Location Search & Site Selection

Users can search for locations across India using:

- City names
- Villages
- Districts
- Landmarks
- Addresses
- Geographic coordinates

Selected locations can be added as assessment sites.

The system supports comparative analysis of multiple locations.

---

## 🗺️ Interactive GIS Workspace

The core workspace provides an interactive map-based interface for exploring assessment locations.

Features include:

- Interactive GIS map
- Site markers
- Location navigation
- Zoom controls
- Coordinate-based navigation
- Multiple assessment sites
- India-focused environmental study workflow

---

## 🌱 Environmental Assessment Categories

Environmental conditions can be assessed across multiple categories.

### 1️⃣ Physical Environment

Parameters include:

- Terrain / Slope Condition
- Flood Susceptibility
- Drainage Condition
- Soil Stability
- Air Quality Sensitivity
- Noise Environment

---

### 2️⃣ Biological Environment

Parameters include:

- Vegetation Sensitivity
- Biodiversity Sensitivity
- Forest / Green Cover Proximity
- Ecologically Sensitive Area Proximity

---

### 3️⃣ Natural Resources

Parameters include:

- Surface Water Proximity
- Groundwater Sensitivity
- Land Resource Sensitivity
- Natural Resource Dependency

---

### 4️⃣ Socio-Economic Environment

Parameters include:

- Settlement Proximity
- Population Sensitivity
- Public Infrastructure Proximity
- Community Sensitivity
- Cultural / Heritage Sensitivity

---

# 🔬 Environmental Assessment Methodologies

ECO-RISK supports multiple structured approaches for environmental evaluation.

## 📋 Checklist Assessment

A parameter-based environmental evaluation method where conditions are assessed systematically.

---

## 📊 Impact Matrix

Supports structured identification and evaluation of potential environmental impacts.

---

## ⚡ Ad-Hoc Assessment

Allows flexible environmental observations and expert-driven assessment.

---

## ⚖️ MCDA – Multi-Criteria Decision Analysis

MCDA is used to support comparative site evaluation by combining multiple environmental criteria using configurable weights.

The system can help answer questions such as:

> Which location has comparatively lower environmental risk?

> Which candidate site is more suitable based on selected environmental criteria?

> Which environmental factors contribute most strongly to the final assessment?

---

# 🧮 Decision Support

ECO-RISK converts assessment information into structured decision-support outputs.

The decision-support layer can provide:

- Environmental risk interpretation
- Comparative site ranking
- Category-wise score analysis
- Weighted MCDA results
- Risk level classification
- Decision recommendations

---

# 📊 Site Comparison

Users can compare multiple candidate locations.

The comparison system helps visualize differences between sites based on:

- Environmental categories
- Assessment scores
- Weighted criteria
- Overall risk
- Decision suitability

---

# 🖥️ User Interface

The ECO-RISK interface follows a clean and professional design focused on environmental decision support.

### Design Characteristics

- 🤍 White-based professional interface
- 🔵 Blue accent system
- 🌍 Earth-inspired branding
- 📊 Clear scientific data visualization
- 🗺️ GIS-centered workspace
- 📱 Responsive layout
- 🧭 Structured assessment navigation

---

# 🏗️ System Architecture

```text
┌───────────────────────────────────────┐
│              USER                     │
└──────────────────┬────────────────────┘
                   │
                   ▼
┌───────────────────────────────────────┐
│          ECO-RISK AI FRONTEND         │
│                                       │
│  React + TypeScript + Vite            │
│  GIS Workspace                        │
│  Environmental Assessment UI          │
│  MCDA & Decision Support              │
└──────────────────┬────────────────────┘
                   │
                   ▼
┌───────────────────────────────────────┐
│           APPLICATION API             │
│                                       │
│             FastAPI Backend           │
│                                       │
└──────────────────┬────────────────────┘
                   │
          ┌────────┴────────┐
          ▼                 ▼
┌─────────────────┐  ┌──────────────────┐
│ Assessment Data │  │ Decision Engine  │
└─────────────────┘  └──────────────────┘