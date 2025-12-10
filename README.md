# Trip Planning Social Platform

This application is a social-style platform that helps groups of people
plan trips together easily. Each trip can have invited members, shared
visit items, likes, and comments. The goal is to make group coordination
simple, transparent, and fun.

## What the App Does

-   **Trips**\
    A user can create a trip and invite members. Trips are private, and
    only invited members can access them.

-   **Visit Items (Places/Events)**\
    Visit items represent suggested places or events for a trip.

    -   They are **public** and searchable.
    -   Some visit items can be linked to a specific trip.
    -   Members can **like** a visit item to show approval.
    -   Members can leave **comments** for each visit item.

-   **Likes & Interaction**

    -   Liking a **trip** shows intention to participate.
    -   Liking a **visit item** shows approval for the proposition.
    -   Comments are available on both trips and visit items.

-   **Comments Microservice**\
    Comments are handled by a separate microservice that stores comment
    data in MongoDB.

## Technologies Used

### Backend (Main Application)

-   **Java 23**
-   **Spring Boot 3.3.4**
    -   Spring Web
    -   Spring Data JPA
    -   Spring Security
    -   OpenFeign client
-   **MySQL** as the primary relational database

### Comments Microservice

-   **Java 23**
-   **Spring Boot 3.3.4**
-   **MongoDB 8** as the NoSQL store for all comments

### Frontend

-   **React**\
    The frontend communicates with the backend services via REST. React provides a
    modern, interactive user experience.

## Local Development Setup

When running locally:

-   The **main Spring application** runs on:\
    `http://localhost:8080`

-   The **comments microservice** runs on:\
    `http://localhost:8081`

-   MongoDB should be run locally on the default port:\
    `27017`

Both services operate independently but communicate through REST APIs.

## Architecture Overview

-   The system is organized as **microservices**:
    -   Main service handles trips, members, visit items, likes, and
        permissions.
    -   Comments service handles all comment-related functionality.
-   The separation improves scalability, clarity, and database
    specialization.
-   MySQL stores structured relational data; MongoDB stores comment
    documents.

## Purpose of the Platform

This application aims to make group travel planning effortless by: -
Allowing shared decision-making - Promoting group communication - Helping
groups vote on proposed locations - Keeping trip-specific discussions
organized through dedicated comments

It acts as a small social network focused on trip organization.

## Status

This is an evolving project with room for additional features such as: -
Notifications - File uploads (maps, images) - More advanced
permissions - Trip timelines and schedules - Location pins - Kafka

