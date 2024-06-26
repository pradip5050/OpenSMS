# OpenSMS

## About

A fully open source, opinionated student management system built with Next.js, PayloadCMS and Tauri v2.0 (beta)

## Frontend platform support

- Web
- Windows (msi, exe)
  - x86
  - ARM
- MacOS
  - x86
  - ARM
- Linux (AppImage, deb, rpm)
- Android (apk)

## Schemas/Collections

### Dynamic

- Users (for backend authentication)
  - Email
  - Password
  - Name
  - Roles (student|faculty|admin)
- Students
  - ID
  - Phone number
  - Date of birth
  - Photo
  - User relation
  - Courses relation
- Faculties
  - ID
  - Phone number
  - Date of birth
  - Photo
  - User relation
  - Courses relation
- Courses
  - Code
  - Name
  - Credits
  - Subjects relation
- Attendances
  - Date
  - Is present
  - Student relation
  - Course relation
- Grades
  - Test type
  - Marks
  - Max marks
  - Student relation
  - Course relation
- Fees
  - Description
  - Amount
  - Due date
  - Payment status
  - Student relation
- Announcements
  - Title
  - Content (in markdown)
- Subjects
  - Code
  - Name

### Static

- Metadata
  - Title
  - Logo
