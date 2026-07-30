# Database Table — Website Feature Mapping

| Table | Handles | Admin Panel Section | Public Pages | API Routes |
|-------|---------|---------------------|--------------|------------|
| **users** | Admin & editor login accounts, role-based access | — (seeded manually) | — | `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`, `PUT /auth/profile`, `PUT /auth/password` |
| **sessions** | Server-side login sessions (stored via `connect-pg-simple`) | — | — | (managed internally by `express-session`) |
| **otps** | OTP codes for email/phone verification during signup | — | Signup — OTP send & verify flow | `POST /auth/send-otp`, `POST /auth/verify-otp`, `POST /auth/check` |
| **courses** | Course catalog — title, description, duration, level, instructor, rating, image | Courses | Home (featured), Courses (grid), Course Detail | `GET /courses`, `GET /courses/all`, `POST /courses`, `PUT /courses/:id`, `DELETE /courses/:id` |
| **instructors** | Instructor profiles — bio, photo, social links, stats | Instructors | Instructors (grid), Instructor Detail | `GET /instructors`, `GET /instructors/all`, `GET /instructors/:id`, `POST /instructors`, `PUT /instructors/:id`, `DELETE /instructors/:id` |
| **instructor_courses** | Many-to-many link between instructors and courses | — | — | (used internally) |
| **blog_posts** | Blog articles — title, content, excerpt, publish state, author | Blog | Blog (list), Blog Detail | `GET /blog`, `GET /blog/all`, `GET /blog/:slug`, `POST /blog`, `PUT /blog/:id`, `DELETE /blog/:id` |
| **testimonials** | Student testimonials — quote, course, rating, featured flag | Testimonials | Home (featured section), Testimonials page | `GET /testimonials`, `GET /testimonials/all`, `POST /testimonials`, `PUT /testimonials/:id`, `DELETE /testimonials/:id` |
| **contact_messages** | Contact form submissions from the public | Messages | Contact page form | `GET /messages`, `POST /messages`, `PUT /messages/:id/read`, `DELETE /messages/:id` |
| **enrollments** | Public course enrollment requests (from unregistered users) | — | Course Detail — "Enroll Now" modal form | `GET /enrollments`, `POST /enrollments`, `PUT /enrollments/:id/status`, `DELETE /enrollments/:id` |
| **students** | Registered student accounts (created during signup) | Students | — | `GET /students`, `POST /students`, `PUT /students/:id`, `DELETE /students/:id` |
| **hero_pages** | Per-page hero section config (carousel on/off, interval) | Heroes | — | `GET /heroes`, `PUT /heroes/:id` |
| **hero_slides** | Individual slides for each hero section — layout, text, images, CTAs, quotes | Heroes (slides) | Home, About, Courses, Instructors, Testimonials, Contact, Blog hero sections | `POST /heroes/:pageId/slides`, `PUT /heroes/:pageId/slides/:slideId`, `DELETE /heroes/:pageId/slides/:slideId` |
| **about_page** | Singleton row storing mission & vision text | About | About page | `GET /about`, `PUT /about` |
| **about_values** | Core values displayed on the About page | About (values) | About page | `GET /about/values`, `POST /about/values`, `PUT /about/values/:id`, `DELETE /about/values/:id` |
| **about_team** | Team member cards on the About page | About (team) | About page | `GET /about/team`, `POST /about/team`, `PUT /about/team/:id`, `DELETE /about/team/:id` |
| **faqs** | FAQ entries with category grouping | FAQ | — | `GET /faqs`, `GET /faqs/all`, `POST /faqs`, `PUT /faqs/:id`, `DELETE /faqs/:id` |
| **site_settings** | Key-value store for site-wide config (name, tagline, trustbar stats, footer contact) | Settings | Footer, Trustbar | `GET /settings`, `PUT /settings` |

---

## Relationship Summary

```
users ──1:N── sessions
users ──1:1── students (linked by email)
courses ──1:N── enrollments (public, unregistered)
courses ──M:N── instructors (via instructor_courses)
courses ──1:N── testimonials
hero_pages ──1:N── hero_slides
about_page ──1:N── about_values
about_page ──1:N── about_team
otps        (standalone, cleaned by expiry)
contact_messages  (standalone)
faqs         (standalone)
site_settings     (standalone)
```

## Notes

- **`users`** holds admin/editor accounts only. Regular students are stored in **`students`**.
- **`enrollments`** is for public (unauthenticated) course signups via the "Enroll Now" modal.
- **`sessions`** is auto-managed by `express-session` + `connect-pg-simple`. Expired rows are cleaned periodically.
- **`otps`** stores one-time passcodes for signup verification. Rows expire after 10 minutes.
