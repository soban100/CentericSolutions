-- Centeric Solutions - PostgreSQL Schema
-- Run this file to create all tables for the application.

-- ============================================
-- USERS & AUTH
-- ============================================
CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(120) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(20)  NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'editor', 'student')),
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================
-- COURSES
-- ============================================
CREATE TABLE courses (
  id          SERIAL PRIMARY KEY,
  slug        VARCHAR(150) NOT NULL UNIQUE,
  title       VARCHAR(200) NOT NULL,
  description TEXT         NOT NULL,
  image_url   TEXT,
  tag         VARCHAR(60)  NOT NULL DEFAULT 'Web Development',
  tag_color   VARCHAR(20)  NOT NULL DEFAULT 'indigo',
  gradient    VARCHAR(200) NOT NULL DEFAULT 'linear-gradient(135deg,#5B4FE5,#2f2793)',
  duration    VARCHAR(30)  NOT NULL DEFAULT '8 weeks',
  level       VARCHAR(20)  NOT NULL DEFAULT 'Beginner' CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  instructor  VARCHAR(120) NOT NULL,
  rating      NUMERIC(2,1) NOT NULL DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
  students    INTEGER      NOT NULL DEFAULT 0,
  is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================
-- INSTRUCTORS
-- ============================================
CREATE TABLE instructors (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(120) NOT NULL,
  role        VARCHAR(120) NOT NULL,
  bio         TEXT         NOT NULL,
  long_bio    TEXT,
  image_url   TEXT,
  specialty   VARCHAR(120),
  tag_color   VARCHAR(20)  NOT NULL DEFAULT 'indigo',
  gradient    VARCHAR(200) NOT NULL DEFAULT 'linear-gradient(135deg,#5B4FE5,#2f2793)',
  twitter_url TEXT,
  linkedin_url TEXT,
  github_url  TEXT,
  students    INTEGER      NOT NULL DEFAULT 0,
  course_count INTEGER     NOT NULL DEFAULT 0,
  rating      NUMERIC(2,1) NOT NULL DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
  is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Join table: which instructors teach which courses
CREATE TABLE instructor_courses (
  instructor_id INTEGER REFERENCES instructors(id) ON DELETE CASCADE,
  course_id     INTEGER REFERENCES courses(id)     ON DELETE CASCADE,
  PRIMARY KEY (instructor_id, course_id)
);

-- ============================================
-- BLOG POSTS
-- ============================================
CREATE TABLE blog_posts (
  id          SERIAL PRIMARY KEY,
  slug        VARCHAR(150) NOT NULL UNIQUE,
  title       VARCHAR(250) NOT NULL,
  content     TEXT         NOT NULL DEFAULT '',
  excerpt     TEXT,
  image_url   TEXT,
  tag         VARCHAR(60)  NOT NULL DEFAULT 'Learning',
  tag_color   VARCHAR(20)  NOT NULL DEFAULT 'indigo',
  author      VARCHAR(120) NOT NULL,
  read_time   VARCHAR(10)  NOT NULL DEFAULT '5 min',
  is_published BOOLEAN     NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  image_placement VARCHAR(20) NOT NULL DEFAULT 'center' CHECK (image_placement IN ('center', 'left', 'right')),
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================
-- TESTIMONIALS
-- ============================================
CREATE TABLE testimonials (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(120) NOT NULL,
  role        VARCHAR(120) NOT NULL DEFAULT '',
  quote       TEXT         NOT NULL,
  image_url   TEXT,
  course      VARCHAR(200) NOT NULL,
  course_id   INTEGER      REFERENCES courses(id) ON DELETE SET NULL,
  tag         VARCHAR(60)  NOT NULL DEFAULT 'Web Development',
  tag_color   VARCHAR(20)  NOT NULL DEFAULT 'indigo',
  outcome     VARCHAR(200) NOT NULL DEFAULT '',
  rating      INTEGER      NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_featured BOOLEAN      NOT NULL DEFAULT FALSE,
  is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================
-- CONTACT MESSAGES (inbox)
-- ============================================
CREATE TABLE contact_messages (
  id        SERIAL PRIMARY KEY,
  name      VARCHAR(120) NOT NULL,
  email     VARCHAR(255) NOT NULL,
  subject   VARCHAR(200) NOT NULL,
  message   TEXT         NOT NULL,
  is_read   BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- ENROLLMENTS (student signups)
-- ============================================
CREATE TABLE enrollments (
  id          SERIAL PRIMARY KEY,
  course_id   INTEGER      REFERENCES courses(id) ON DELETE CASCADE,
  course_name VARCHAR(200) NOT NULL,
  name        VARCHAR(120) NOT NULL,
  email       VARCHAR(255) NOT NULL,
  phone       VARCHAR(30),
  degree      VARCHAR(200),
  college     VARCHAR(200),
  status      VARCHAR(20)  NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'enrolled', 'cancelled')),
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================
-- STUDENTS (login / registered students)
-- ============================================
CREATE TABLE students (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(120) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone         VARCHAR(30),
  degree        VARCHAR(200),
  college       VARCHAR(200),
  avatar_url    TEXT,
  is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================
-- HERO SECTIONS (per-page carousel config)
-- ============================================
CREATE TABLE hero_pages (
  id            VARCHAR(40)  PRIMARY KEY,
  page          VARCHAR(60)  NOT NULL,
  route         VARCHAR(100) NOT NULL,
  carousel_enabled BOOLEAN   NOT NULL DEFAULT FALSE,
  carousel_interval INTEGER  NOT NULL DEFAULT 5 CHECK (carousel_interval >= 1 AND carousel_interval <= 10),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE hero_slides (
  id              SERIAL PRIMARY KEY,
  hero_page_id    VARCHAR(40) NOT NULL REFERENCES hero_pages(id) ON DELETE CASCADE,
  sort_order      INTEGER     NOT NULL DEFAULT 0,
  layout          VARCHAR(20) NOT NULL DEFAULT 'standard' CHECK (layout IN ('standard', 'split', 'quote')),
  gradient_origin VARCHAR(30) NOT NULL DEFAULT '50% 50%',
  eyebrow         VARCHAR(200),
  title           TEXT,
  subtitle        TEXT,
  image_url       TEXT,
  -- split layout fields
  stat_1_num      VARCHAR(20),
  stat_1_label    VARCHAR(60),
  stat_2_num      VARCHAR(20),
  stat_2_label    VARCHAR(60),
  stat_3_num      VARCHAR(20),
  stat_3_label    VARCHAR(60),
  cta_primary_text  VARCHAR(100),
  cta_primary_href  VARCHAR(200),
  cta_secondary_text VARCHAR(100),
  cta_secondary_href VARCHAR(200),
  -- quote layout fields
  quote_text      TEXT,
  quote_author    VARCHAR(120),
  quote_role      VARCHAR(120),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- ABOUT PAGE
-- ============================================
CREATE TABLE about_page (
  id            INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),  -- singleton row
  mission_title VARCHAR(200) NOT NULL DEFAULT 'Democratize practical tech education.',
  mission_body  TEXT         NOT NULL,
  vision_title  VARCHAR(200) NOT NULL DEFAULT 'A world where skill matters more than pedigree.',
  vision_body   TEXT         NOT NULL,
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE about_values (
  id    SERIAL PRIMARY KEY,
  icon  VARCHAR(30)  NOT NULL DEFAULT 'target',
  title VARCHAR(120) NOT NULL,
  body  TEXT         NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE about_team (
  id        SERIAL PRIMARY KEY,
  name      VARCHAR(120) NOT NULL,
  role      VARCHAR(120) NOT NULL,
  bio       TEXT         NOT NULL,
  image_url TEXT,
  sort_order INTEGER    NOT NULL DEFAULT 0
);

-- ============================================
-- FAQ
-- ============================================
CREATE TABLE faqs (
  id          SERIAL PRIMARY KEY,
  question    TEXT   NOT NULL,
  answer      TEXT   NOT NULL,
  category    VARCHAR(60) DEFAULT 'General',
  sort_order  INTEGER    NOT NULL DEFAULT 0,
  is_active   BOOLEAN    NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- SESSIONS (server-side auth)
-- ============================================
CREATE TABLE sessions (
  sid        VARCHAR(128) PRIMARY KEY,
  sess       JSONB NOT NULL,
  expire     TIMESTAMPTZ NOT NULL,
  user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_sessions_expire ON sessions(expire);
CREATE INDEX idx_sessions_user   ON sessions(user_id);

-- ============================================
-- SITE SETTINGS
-- ============================================
CREATE TABLE site_settings (
  key   VARCHAR(60) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed default settings
INSERT INTO site_settings (key, value) VALUES
  ('site_name', 'Centeric Solutions'),
  ('site_tagline', 'Technology Academy'),
  ('trustbar_students', '2,400+'),
  ('trustbar_courses', '18'),
  ('trustbar_completion', '94%'),
  ('footer_email', 'hello@centericsolutions.com'),
  ('footer_phone', '+1 (555) 000-0000');

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_courses_slug       ON courses(slug);
CREATE INDEX idx_courses_tag        ON courses(tag);
CREATE INDEX idx_courses_level      ON courses(level);
CREATE INDEX idx_courses_instructor ON courses(instructor);
CREATE INDEX idx_blog_posts_slug    ON blog_posts(slug);
CREATE INDEX idx_blog_posts_tag     ON blog_posts(tag);
CREATE INDEX idx_blog_posts_author  ON blog_posts(author);
CREATE INDEX idx_blog_posts_published ON blog_posts(published_at) WHERE is_published = TRUE;
CREATE INDEX idx_testimonials_course  ON testimonials(course);
CREATE INDEX idx_testimonials_featured ON testimonials(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_contact_messages_read ON contact_messages(is_read);
CREATE INDEX idx_students_email           ON students(email);
CREATE INDEX idx_hero_slides_page      ON hero_slides(hero_page_id, sort_order);
CREATE INDEX idx_faqs_category         ON faqs(category);

-- ============================================
-- OTP VERIFICATION (signup / phone & email)
-- ============================================
CREATE TABLE otps (
  id         SERIAL PRIMARY KEY,
  method     VARCHAR(10) NOT NULL CHECK (method IN ('email', 'phone')),
  value      VARCHAR(255) NOT NULL,
  otp        VARCHAR(6) NOT NULL,
  token      VARCHAR(64),
  verified   BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_otps_value_method ON otps(value, method);

-- ============================================
-- NOTIFICATIONS (student-facing)
-- ============================================
CREATE TABLE notifications (
  id         SERIAL PRIMARY KEY,
  type       VARCHAR(30) NOT NULL CHECK (type IN ('new_blog', 'new_course', 'new_testimonial')),
  title      VARCHAR(255) NOT NULL,
  body       TEXT,
  link       VARCHAR(255),
  is_read    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_read ON notifications(is_read, created_at DESC);
