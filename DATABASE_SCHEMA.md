# Database Schema — Medical Conference (PayloadCMS)

> PayloadCMS automatically adds `id`, `createdAt`, and `updatedAt` to every collection (omitted below).
> Fields marked `*author` come from the shared `collectionAuthor` utility (`createdBy → users`, `updatedBy → users`).

## ER Diagram

```mermaid
erDiagram

  %% ─────────────────── AUTH / IDENTITY ───────────────────

  users {
    string    firstName       "required"
    string    lastName        "required"
    string    fullname        "computed index"
    string    email           "built-in auth"
    string    password        "built-in auth"
    bool      active          "default true"
    select    title           "Dr/Prof/Mr/Ms/Mx"
    select    role            "admin|modifier|user"
    string    organization
    string    medicalLicenseNumber
    string    specialization
    string    phoneNumber
    text      address
    upload    avatar          "→ media"
    rel       interests       "→ topics (hasMany)"
  }

  user_groups {
    string    name            "required"
    text      description
    rel       users           "→ users (hasMany)"
    rel       createdBy       "→ users *author"
    rel       updatedBy       "→ users *author"
  }

  %% ─────────────────── TAXONOMY ───────────────────────────

  categories {
    string    name            "required unique"
    text      description
    bool      active          "default true"
    rel       createdBy       "→ users *author"
    rel       updatedBy       "→ users *author"
  }

  topics {
    string    name            "required unique"
    text      description
    richText  content
    bool      active          "default true"
    rel       category        "→ categories"
    join      conference      "← posts.topics"
    rel       createdBy       "→ users *author"
    rel       updatedBy       "→ users *author"
  }

  %% ─────────────────── CONTENT ────────────────────────────

  posts["posts (Conferences)"] {
    string    title
    text      theme
    bool      active          "default false"
    string    venueName       "required"
    string    venueCity       "required"
    date      abstractSubmissionDeadline
    date      notificationOfAcceptanceDate
    date      earlyRegistrationDeadline
    date      startDate
    date      endDate
    array     contactEmails   "[{email}]"
    array     contactPhones   "[{phone}]"
    rel       host            "→ user-groups"
    rel       topics          "→ topics (hasMany)"
    rel       relatedConferences "→ posts (hasMany self)"
    object    meta            "SEO: title/description/image"
    string    slug
    rel       createdBy       "→ users *author"
    rel       updatedBy       "→ users *author"
  }

  pages {
    string    title           "required"
    blocks    layout          "CTA|Content|MediaBlock|FormBlock"
    hero      hero
    date      publishedAt
    string    slug
    object    meta            "SEO: title/description/image"
    rel       createdBy       "→ users *author"
    rel       updatedBy       "→ users *author"
  }

  %% ─────────────────── ABSTRACTS ──────────────────────────

  abstracts {
    string    title           "required"
    string    submitterName   "anon only"
    email     submitterEmail  "anon only"
    string    submitterOrganization "anon only"
    string    nameOfStudy
    text      aim             "required"
    text      methods         "required"
    text      results         "required"
    text      conclusion      "required"
    array     keywords        "[{word}]"
    select    status          "draft|pending|rejected|verified"
    rel       submitter       "→ users (null=anonymous)"
    rel       conference      "→ posts"
    rel       topic           "→ topics"
    rel       files           "→ public-files (hasMany)"
  }

  %% ─────────────────── MEDIA & FILES ─────────────────────

  media {
    string    alt
    upload    file            "Uploadthing (jpg/png)"
    rel       createdBy       "→ users *author"
    rel       updatedBy       "→ users *author"
  }

  files {
    upload    file            "Uploadthing (pdf/doc/docx)"
  }

  public_files["public-files"] {
    string    url             "required CDN URL"
    string    key             "required UT key"
    string    filename        "required"
    string    mimeType
    number    filesize
    rel       uploadedBy      "→ users (null=anon)"
    rel       abstract        "→ abstracts (null=orphan)"
  }

  %% ─────────────────── SOCIAL ─────────────────────────────

  comments {
    text      content         "required"
    rel       post            "→ posts"
    rel       user            "→ users"
  }

  likes {
    rel       user            "→ users (indexed)"
    rel       post            "→ posts (indexed)"
  }

  %% ─────────────────── SEATS / ROOMS ──────────────────────

  rooms {
    string    name            "required"
    number    totalSeat       "required"
  }

  seats {
    select    type            "VIP|MIDDLE|FREE"
    select    status          "AVAILABLE|ON_HOLD|SOLD"
    string    label           "indexed"
    rel       room            "→ rooms (indexed)"
  }

  reservations {
    select    status          "PENDING|CONFIRMED|CANCELLED"
    rel       seat            "→ seats"
    rel       user            "→ users"
  }

  %% ─────────────────── SYSTEM ─────────────────────────────

  mail_logs["mail-logs"] {
    string    to              "required"
    string    subject         "required"
    text      html            "required"
    select    status          "pending|processing|sent|failed|dead-letter"
    number    retryCount      "default 0"
    string    lastError
    date      sentAt
    rel       abstractId      "→ abstracts"
  }


  %% ─────────────────── RELATIONSHIPS ──────────────────────

  users          ||--o{ abstracts      : "submits"
  users          ||--o{ comments       : "writes"
  users          ||--o{ likes          : "gives"
  users          ||--o{ reservations   : "makes"
  users          }o--o{ user_groups    : "member of"
  users          ||--o{ public_files   : "uploads"
  users          ||--o| media          : "avatar"

  user_groups    ||--o{ posts          : "hosts"

  categories     ||--o{ topics         : "groups"

  topics         }o--o{ posts          : "tagged in"
  topics         }o--o{ abstracts      : "topic of"
  topics         }o--o{ users          : "interest of"

  posts          ||--o{ abstracts      : "receives"
  posts          ||--o{ comments       : "has"
  posts          ||--o{ likes          : "has"
  posts          }o--o{ posts          : "related to"

  abstracts      ||--o{ public_files   : "attaches"
  abstracts      ||--o{ mail_logs      : "triggers"

  rooms          ||--o{ seats          : "contains"
  seats          ||--o{ reservations   : "reserved via"
```

## Collection Summary

| Collection       | Slug           | Purpose                     | Key Relations                              |
| ---------------- | -------------- | --------------------------- | ------------------------------------------ |
| **Users**        | `users`        | Auth & profiles             | → media (avatar), → topics (interests)     |
| **UserGroups**   | `user-groups`  | Host organizations          | → users (members)                          |
| **Categories**   | `categories`   | Top-level taxonomy          | —                                          |
| **Topics**       | `topics`       | Sub-topics in a category    | → categories, ← posts, ← abstracts         |
| **Posts**        | `posts`        | Conference events           | → user-groups (host), → topics             |
| **Pages**        | `pages`        | Static CMS pages            | —                                          |
| **Abstracts**    | `abstracts`    | Abstract submissions        | → posts, → topics, → users, → public-files |
| **Media**        | `media`        | Images (jpg/png)            | —                                          |
| **Files**        | `files`        | Private docs (pdf/doc)      | —                                          |
| **PublicFiles**  | `public-files` | Client-uploaded attachments | → users, → abstracts                       |
| **Comments**     | `comments`     | Conference comments         | → posts, → users                           |
| **Likes**        | `likes`        | Conference likes            | → posts, → users                           |
| **Rooms**        | `rooms`        | Venue rooms                 | —                                          |
| **Seats**        | `seats`        | Seats in a room             | → rooms                                    |
| **Reservations** | `reservations` | Seat bookings               | → seats, → users                           |
| **MailLogs**     | `mail-logs`    | Email queue & audit         | → abstracts                                |
