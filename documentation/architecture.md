# Architekturentscheidungen – Projekt „Adressänderung bei Umzug“

## 1. Zielsetzung
Die Anwendung soll Bürgern die Möglichkeit geben, **Adressänderungen bei Umzügen** digital und automatisiert durchzuführen.

Wichtige Anforderungen:
- **Authentifizierung über BundID** (inkl. eID-Ausweisfunktion).
- **Automatisierte Weiterleitung** der neuen Adresse an relevante Behörden und Institutionen.
- **API-First-Ansatz**, damit Frontend und Backend **parallel** entwickelt werden können.

---

## 2. Technologiewahl (Tech Stack)
- **Frontend**: React  
  → Moderne Web UI, großes Ökosystem, gutes State-Management.
- **Backend**: Java mit Spring Boot  
  → Stabil, etabliert, sehr gute Integrationsmöglichkeiten.
- **API-Spezifikation**: OpenAPI  
  → Zentrale Schnittstellenbeschreibung, Generatoren für Backend und Frontend.
- **Datenbank**: PostgreSQL  
  → Relational, zuverlässig, Open Source.
- **Deployment**: Container-basiert (Docker, später Kubernetes).

Diese Kombination ermöglicht **schnelle Entwicklung**, **saubere Trennung von Verantwortlichkeiten** und ist **zukunftssicher**.

---

## 3. Architekturprinzipien
- **API-First**
    - OpenAPI-Spezifikation wird vor der Implementierung erstellt.
    - Parallele Entwicklung von Frontend und Backend möglich.
    - Mock-APIs (Prism, WireMock) ermöglichen frühes Testen im Frontend.

- **Hexagonal / Onion Architecture** (Backend)
    - **Domain Layer**: Geschäftslogik und Modelle (`Person`, `Address`, `AddressChangeRequest`).
    - **Application Layer**: Use Cases, Ports, Orchestrierung.
    - **Infrastructure Layer**: Implementierungen externer Schnittstellen (BundID API, DB, Behörden-Adapter).
    - **Web Layer**: REST-Controller, die OpenAPI-Schnittstellen umsetzen.

- **Security by Design**
    - Authentifizierung über OAuth2 / OpenID Connect (BundID).
    - DSGVO-konforme Speicherung und Verarbeitung von Personendaten.
    - Datenminimierung: Speicherung nur der für den Prozess notwendigen Daten.

---

## 4. Zielarchitektur (High-Level)

[ React Frontend ] <---> [ Spring Boot Backend (REST API) ] <---> [ BundID API ]
| |
| +--> [ Behörden-Schnittstellen (Meldeamt, Versicherungen, Banken) ]
|
+--> [ Mock API (OpenAPI / Prism) für parallele Entwicklung ]


---

## 5. Entwicklungs-Setup
- **Monorepo-Ansatz**

project-root/
├── backend/ # Spring Boot Backend
├── frontend/ # React Frontend
├── api-specs/ # OpenAPI Spezifikationen
└── docs/ # Dokumentation


- **Parallele Entwicklung**
- Backend generiert API-Stubs aus `api-specs`.
- Frontend generiert API-Clients aus derselben Spezifikation.
- Mock-Server ermöglicht Frontend-Entwicklung vor Backend-Funktionalität.

---

## 6. Vorteile der Architektur
- **Lose Kopplung** zwischen Frontend und Backend.
- **Hohe Testbarkeit** (Unit-Tests im Domain Layer, Contract-Tests mit OpenAPI).
- **Erweiterbarkeit** (Behörden-Schnittstellen modular ergänzbar).
- **Skalierbarkeit** durch Containerisierung und Spring Boot Microservices.
»