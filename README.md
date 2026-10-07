# CMS – Portfolio

![Java](https://img.shields.io/badge/Java-25-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1.1-brightgreen)
![Spring Cloud](https://img.shields.io/badge/Spring%20Cloud-2025.1.3-blue)
![React](https://img.shields.io/badge/React-19.2-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178C6)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791)
![Architecture](https://img.shields.io/badge/Architecture-Microservices-purple)

A full-stack **Content Management System and Portfolio platform** built with Java, Spring Boot, Spring Cloud, React, TypeScript and PostgreSQL.

The project is designed around a reusable backend platform, independently deployable services, publication-based content management, JWT security and provider-independent media storage.

---

## Overview

CMS – Portfolio manages the content behind a personal portfolio while keeping administration and public presentation separate.

The platform supports:

- Profile management
- About section management
- Skills and technologies
- Project management
- Project galleries and media
- Experience management
- Social profiles
- SEO settings
- Display settings
- Publication/version management
- Media library
- JWT authentication and authorization
- Local or Azure Blob Storage
- Centralized configuration
- Service discovery
- API Gateway routing
- Centralized request and exception logging

The **CMS UI** is used to manage content, while the **Portfolio UI** consumes the currently published version and presents it publicly.

---

# Architecture

```text
                              ┌──────────────────────┐
                              │      Web Clients     │
                              │                      │
                              │  CMS UI / Portfolio  │
                              └──────────┬───────────┘
                                         │
                                         ▼
                              ┌──────────────────────┐
                              │     API Gateway      │
                              │      :9090            │
                              └──────────┬───────────┘
                                         │
                     ┌───────────────────┴───────────────────┐
                     │                                       │
                     ▼                                       ▼
          ┌─────────────────────┐                 ┌─────────────────────┐
          │   Identity Service  │                 │ Maintenance Service │
          │       :8080         │                 │       :8081         │
          │                     │                 │                     │
          │ Authentication      │                 │ Portfolio Content   │
          │ Users / Roles       │                 │ Publications        │
          │ JWT / Refresh       │                 │ Projects / Skills   │
          └──────────┬──────────┘                 │ Experience / Media  │
                     │                            └──────────┬──────────┘
                     │                                       │
                     ▼                                       ▼
          ┌─────────────────────┐                 ┌─────────────────────┐
          │ PostgreSQL          │                 │ StorageService      │
          │ cms_identity        │                 │                     │
          └─────────────────────┘                 │ Local / Azure Blob  │
                                                  └─────────────────────┘

              ┌──────────────────────────────────────────────┐
              │                Spring Cloud                  │
              │                                              │
              │  Eureka Server :8761   Config Server :8888  │
              └──────────────────────────────────────────────┘

              ┌──────────────────────────────────────────────┐
              │              Shared Platform                 │
              │                                              │
              │ Logging │ Security │ RestClient │ Web        │
              └──────────────────────────────────────────────┘
```

### Request flow

```text
Browser
   │
   ▼
API Gateway
   │
   ├── /identity/** ──► Identity Service
   │
   └── /cms/** ───────► Maintenance Service
                              │
                              ├── PostgreSQL
                              │
                              └── StorageService
                                    ├── Local Filesystem
                                    └── Azure Blob Storage
```

---

# Platform

A major part of the project is the reusable **platform layer**.

Instead of implementing cross-cutting concerns separately in every service, they are packaged as reusable Spring Boot modules.

| Module | Responsibility |
|---|---|
| `logging` | Correlation ID, request logging, exception logging, MDC and rolling file logging |
| `security` | JWT resource server, authentication context, authorization, CORS and security infrastructure |
| `restclient` | Request-context and bearer-token propagation for downstream calls |
| `web` | Shared web infrastructure and common exception/error handling |

This allows the business services to remain focused on their actual domain responsibilities.

---

# Services

## Identity Service

Responsible for:

- User registration and management
- Authentication
- JWT access tokens
- Refresh tokens
- Logout
- Role-based authorization
- Password encryption using BCrypt
- Validation
- Soft deletion
- REST API documentation
- Unit and controller integration tests

Base API:

```text
/identity/api/v1
```

---

## Maintenance Service

The main portfolio CMS service.

Responsible for:

- Profile
- About
- Skills
- Technologies
- Projects
- Experience
- Social profiles
- Publications
- Media
- Contact requests
- Display settings
- SEO settings

Base API:

```text
/cms/api/v1
```

---

# Publication Model

The portfolio uses a **publication-based content model**.

A publication represents a version of the portfolio and references reusable content.

```text
Publication
│
├── Profile
├── Display Settings
├── SEO Settings
├── About
├── Skills
├── Projects
├── Experiences
└── Social Profiles
```

### Publication lifecycle

```text
             ┌─────────┐
             │  DRAFT  │
             └────┬────┘
                  │
                  │ Publish
                  ▼
             ┌─────────┐
             │ PUBLISH │
             └────┬────┘
                  │
                  │ Unpublish
                  ▼
            ┌─────────────┐
            │ UN_PUBLISH  │
            └─────────────┘
```

This separates **content authoring** from the **public portfolio**.

The public application only consumes the published publication.

---

# Media Architecture

Media metadata is managed by the Maintenance Service while actual binary storage is abstracted behind:

```text
StorageService
      │
      ├── LocalStorageServiceImp
      │
      └── AzureBlobStorageService
```

This allows the same application code to work with either local storage or Azure Blob Storage.

Supported media extensions currently include:

```text
png
jpg
jpeg
gif
webp
```

Maximum multipart request size:

```text
10 MB
```

---

# Azure & Local Storage

## Local Development

The Maintenance Service can use local filesystem storage.

```yaml
config:
  storage:
    provider: local
    local:
      base-path: "filestore"
```

When local storage is selected, uploaded files are stored on the application host.

---

## Azure Blob Storage

Azure Blob Storage can be selected through configuration:

```yaml
config:
  storage:
    provider: azure
    azure:
      connection-string: ${AZURE_STORAGE_CONNECTION_STRING}
      container-name: ${AZURE_STORAGE_CONTAINER}
```

Environment variables:

```env
AZURE_STORAGE_CONNECTION_STRING=<your-connection-string>
AZURE_STORAGE_CONTAINER=<your-container>
```

The Azure implementation uses the Azure Blob Storage SDK and stores media as blobs.

---

# Frontend

The project contains two React applications.

## CMS UI

Authenticated administration interface.

Main areas include:

- Publication
![Publication](docs/images/publication.png)
- Profile
![Profile](docs/images/profile.png)
- About
![About](docs/images/about.png)
- Skills
![Skills](docs/images/skills.png)
- Projects
![Projects](docs/images/projects.png)
- Edit Projects
![EditProjects](docs/images/edit_project.png)
- Experience
![Experience](docs/images/experiences.png)
- Library Editing
![LibraryEdit](docs/images/library_edit.png)
- Library
![Library](docs/images/library.png)
- Library Upload
![LibraryUpload](docs/images/library_upload.png)
- Library Pages
![LibraryPages](docs/images/library_pages.png)
- Contact Requests
![ContactRequests](docs/images/contact_reqs.png)
- SEO Settings
![SEOSettings](docs/images/seo_stngs.png)


Technology:

```text
React
TypeScript
Vite
Tailwind CSS
Axios
React Router
Heroicons
```

---

## Portfolio UI

The public-facing portfolio.

It consumes the published portfolio configuration and renders:

- Profile
![Profile](docs/images/prtf_profile.png)
- Skills
![Skills](docs/images/prtf_skills.png)
- Projects
![Projects](docs/images/prtf_projects.png)
- Experience & Contact
![Experience](docs/images/prtf_exp_cntc.png)
- SEO metadata
![Seo](docs/images/prtf_seo.png)

The UI is responsive and built with React, TypeScript and Tailwind CSS.

---

# Repository Structure

```text
CMS - Portfolio
│
├── platform/
│   ├── logging/
│   ├── security/
│   ├── restclient/
│   └── web/
│
├── cloud/
│   ├── configserver/
│   ├── eurekaserver/
│   ├── apigateway/
│   └── repo/
│
├── services/
│   ├── identity/
│   └── maintenance/
│
├── ui/
│   ├── cms/
│   └── portfolio/
│
├── docker/
│   └── postgres/
│
├── docs/
│   └── images/
│
└── pom.xml
```

The backend is a **multi-module Maven monorepo**.

---

# Technology Stack

### Backend

- Java 25
- Spring Boot 4.1.1
- Spring Security
- Spring Data JPA
- Spring Cloud 2025.1.3
- Spring Cloud Config
- Spring Cloud Gateway MVC
- Netflix Eureka
- JWT / JJWT
- PostgreSQL
- Springdoc OpenAPI
- Azure Storage Blob SDK

### Frontend

- React 19.2
- TypeScript 6
- Vite 8
- Tailwind CSS 4
- Axios
- React Router
- Heroicons / React Icons

### Infrastructure

- Docker
- PostgreSQL
- Azure Blob Storage
- Maven
- npm

---

# Configuration Architecture

Configuration is externalized using **Spring Cloud Config Server**.

```text
Application
     │
     ▼
Config Server :8888
     │
     ▼
cloud/repo/
     │
     ├── application.yml
     ├── cms-identity-service.yml
     ├── cms-maintenance-service.yml
     └── cms-api-gateway.yml
```

This keeps environment-specific configuration outside the individual service codebases.

---

# Service Discovery

Eureka Server runs on:

```text
http://localhost:8761
```

Services register themselves with Eureka.

The API Gateway uses service discovery for routing:

```yaml
uri: lb://cms-identity-service
```

and:

```yaml
uri: lb://cms-maintenance-service
```

---

# API Gateway

Gateway runs on:

```text
http://localhost:9090
```

Routes:

| Path | Service |
|---|---|
| `/identity/**` | Identity Service |
| `/cms/**` | Maintenance Service |

This keeps clients independent of the actual service host/port.

---

# Important API Endpoints

## Authentication

```text
POST /identity/api/v1/auth/
POST /identity/api/v1/auth/refresh
POST /identity/api/v1/auth/logout
```

## User

```text
GET    /identity/api/v1/users/me
GET    /identity/api/v1/users/
POST   /identity/api/v1/users/
POST   /identity/api/v1/users/search
PUT    /identity/api/v1/users/{id}
PATCH  /identity/api/v1/users/
DELETE /identity/api/v1/users/{id}
```

## Portfolio Content

```text
/cms/api/v1/profile
/cms/api/v1/about
/cms/api/v1/skills
/cms/api/v1/technologies
/cms/api/v1/projects
/cms/api/v1/experience
/cms/api/v1/socialprofile
/cms/api/v1/publish
/cms/api/v1/media
```

## Public APIs

```text
GET  /cms/api/v1/publish/publication
GET  /cms/api/v1/media/fetch/{mediaId}
POST /cms/api/v1/media/fetch
POST /cms/api/v1/contact/sendquote
```

---

# Security

The platform uses stateless JWT-based authentication.

```text
Login
  │
  ▼
Identity Service
  │
  ├── Validate credentials
  │
  ├── Generate access token
  │
  └── Generate refresh token
          │
          ▼
       Client
          │
          │ Authorization: Bearer <JWT>
          ▼
    API Gateway / Service
          │
          ▼
    Platform Security
          │
          ▼
    Authenticated User
```

Security features include:

- JWT authentication
- Refresh tokens
- Stateless sessions
- Role-based authorization
- BCrypt password hashing
- Public endpoint configuration
- CORS configuration
- Authenticated-user abstraction

---

# Logging & Observability

The shared logging platform provides:

- Correlation IDs
- Request logging
- Exception logging
- MDC request context
- Query-string logging configuration
- Rolling application logs

Request context can also be propagated through the RestClient platform module.

```text
Request
   │
   ▼
Correlation ID
   │
   ├── Gateway
   │
   ├── Identity / Maintenance
   │
   └── Downstream RestClient calls
```

This makes distributed requests easier to trace.

---

# Database

PostgreSQL is used by the backend services.

Separate databases are configured for the major services:

```text
cms_identity
cms_maintenance
```

The repository also contains the database schema documentation:

```text
docs/images/schema.png
```

---

# Local Development

## Prerequisites

Install:

- Java 25
- Maven
- Node.js
- npm
- PostgreSQL or Docker
- Git

Azure is optional when using local media storage.

---

## Start PostgreSQL with Docker

```bash
cd docker/postgres
docker compose up -d
```

This starts:

```text
PostgreSQL :5432
pgAdmin    :5050
```

---

## Start Infrastructure

Start the services in this order:

### 1. Eureka Server

```bash
cd cloud/eurekaserver
mvn spring-boot:run
```

Runs on:

```text
http://localhost:8761
```

### 2. Config Server

```bash
cd cloud/configserver
mvn spring-boot:run
```

Runs on:

```text
http://localhost:8888
```

### 3. API Gateway

```bash
cd cloud/apigateway
mvn spring-boot:run
```

Runs on:

```text
http://localhost:9090
```

### 4. Identity Service

```bash
cd services/identity
mvn spring-boot:run
```

### 5. Maintenance Service

```bash
cd services/maintenance
mvn spring-boot:run
```

---

# Frontend Development

## CMS

```bash
cd ui/cms
npm install
npm run dev
```

## Portfolio

```bash
cd ui/portfolio
npm install
npm run dev
```

The Vite applications normally run on ports in the `5173+` range.

---

# Build

Build all backend modules from the root:

```bash
mvn clean install
```

Build the CMS UI:

```bash
cd ui/cms
npm run build
```

Build the Portfolio UI:

```bash
cd ui/portfolio
npm run build
```

---

# Testing

Backend modules use the Spring Boot testing ecosystem with JUnit and Mockito.

Run the complete Maven test suite:

```bash
mvn test
```

Frontend applications provide:

```bash
npm run lint
npm run build
```

---

# API Documentation

Springdoc OpenAPI is included in the backend services.

Swagger UI is available through the respective service when running locally:

```text
/swagger-ui/index.html
```

OpenAPI documentation:

```text
/v3/api-docs
```

---

# Documentation

Additional project documentation is maintained under:

```text
docs/
```

The repository includes the database schema image and the project-level documentation covers:

- Architecture
- Platform modules
- Publication model
- Media storage
- Azure configuration
- Local configuration
- UI architecture
- API surface
- Operational notes

---

# Architectural Principles

The project follows these principles:

- Microservices architecture
- Separation of concerns
- Reusable platform infrastructure
- Stateless authentication
- Centralized configuration
- Service discovery
- API Gateway pattern
- Provider-independent media storage
- Publication-based content management
- RESTful service boundaries
- Independent service modules
- Reusable React components

---

# Future Direction

Potential areas for further evolution include:

- Containerized deployment
- Kubernetes
- Azure-native deployment
- CI/CD automation
- Distributed tracing
- Centralized monitoring
- Event-driven communication
- Production-grade secret management
- CDN-backed media delivery

---

# Author

**Venkata Kiran J**

Full Stack Engineer — Java · React · AI

GitHub:

https://github.com/vkiranjakkapu

LinkedIn:

https://www.linkedin.com/in/venkata-kiran-jakkapu-a2209415a/

---

## License

This project is developed as a personal engineering project and portfolio platform.
