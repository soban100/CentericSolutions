const BASE = "http://localhost:4000/api";

async function request(url, options = {}) {
  const res = await fetch(`${BASE}${url}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    let msg = `API error: ${res.status}`;
    try { const body = await res.json(); if (body.error) msg = body.error; } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export const api = {
  // Auth
  login: (data) => request("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  register: (data) => request("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  logout: () => request("/auth/logout", { method: "POST" }),
  getMe: () => request("/auth/me"),
  updateProfile: (data) => request("/auth/profile", { method: "PUT", body: JSON.stringify(data) }),
  changePassword: (data) => request("/auth/password", { method: "PUT", body: JSON.stringify(data) }),
  sendOtp: (data) => request("/auth/send-otp", { method: "POST", body: JSON.stringify(data) }),
  verifyOtp: (data) => request("/auth/verify-otp", { method: "POST", body: JSON.stringify(data) }),
  checkDuplicate: (data) => request("/auth/check", { method: "POST", body: JSON.stringify(data) }),
  // Courses
  getCourses: () => request("/courses/all"),
  getPublishedCourses: () => request("/courses"),
  createCourse: (data) => request("/courses", { method: "POST", body: JSON.stringify(data) }),
  updateCourse: (id, data) => request(`/courses/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteCourse: (id) => request(`/courses/${id}`, { method: "DELETE" }),

  // Instructors
  getInstructors: () => request("/instructors/all"),
  getPublishedInstructors: () => request("/instructors"),
  getInstructor: (id) => request(`/instructors/${id}`),
  createInstructor: (data) => request("/instructors", { method: "POST", body: JSON.stringify(data) }),
  updateInstructor: (id, data) => request(`/instructors/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteInstructor: (id) => request(`/instructors/${id}`, { method: "DELETE" }),

  // Blog
  getBlogPosts: () => request("/blog/all"),
  getPublishedBlogPosts: () => request("/blog"),
  getBlogPost: (slug) => request(`/blog/${slug}`),
  createBlogPost: (data) => request("/blog", { method: "POST", body: JSON.stringify(data) }),
  updateBlogPost: (id, data) => request(`/blog/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteBlogPost: (id) => request(`/blog/${id}`, { method: "DELETE" }),

  // Testimonials
  getTestimonials: () => request("/testimonials/all"),
  getPublishedTestimonials: () => request("/testimonials"),
  createTestimonial: (data) => request("/testimonials", { method: "POST", body: JSON.stringify(data) }),
  updateTestimonial: (id, data) => request(`/testimonials/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteTestimonial: (id) => request(`/testimonials/${id}`, { method: "DELETE" }),

  // Messages
  getMessages: () => request("/messages"),
  createMessage: (data) => request("/messages", { method: "POST", body: JSON.stringify(data) }),
  markMessageRead: (id) => request(`/messages/${id}/read`, { method: "PUT" }),
  deleteMessage: (id) => request(`/messages/${id}`, { method: "DELETE" }),

  // Enrollments
  getEnrollments: () => request("/enrollments"),
  createEnrollment: (data) => request("/enrollments", { method: "POST", body: JSON.stringify(data) }),
  updateEnrollmentStatus: (id, status) => request(`/enrollments/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }),
  deleteEnrollment: (id) => request(`/enrollments/${id}`, { method: "DELETE" }),

  // Students
  getStudents: () => request("/students"),
  createStudent: (data) => request("/students", { method: "POST", body: JSON.stringify(data) }),
  updateStudent: (id, data) => request(`/students/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteStudent: (id) => request(`/students/${id}`, { method: "DELETE" }),

  // Heroes
  getHeroes: () => request("/heroes"),
  updateHeroPage: (id, data) => request(`/heroes/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  createHero: (pageId, data) => request(`/heroes/${pageId}/slides`, { method: "POST", body: JSON.stringify(data) }),
  updateHero: (pageId, slideId, data) => request(`/heroes/${pageId}/slides/${slideId}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteHero: (pageId, slideId) => request(`/heroes/${pageId}/slides/${slideId}`, { method: "DELETE" }),
  updateCarousel: (pageId, data) => request(`/heroes/${pageId}`, { method: "PUT", body: JSON.stringify({ carousel: data }) }),

  // About
  getAbout: () => request("/about"),
  getAboutValues: () => request("/about/values"),
  getAboutTeam: () => request("/about/team"),
  updateAbout: (data) => request("/about", { method: "PUT", body: JSON.stringify(data) }),
  createAboutValue: (data) => request("/about/values", { method: "POST", body: JSON.stringify(data) }),
  updateAboutValue: (id, data) => request(`/about/values/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteAboutValue: (id) => request(`/about/values/${id}`, { method: "DELETE" }),
  createAboutTeam: (data) => request("/about/team", { method: "POST", body: JSON.stringify(data) }),
  updateAboutTeam: (id, data) => request(`/about/team/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteAboutTeam: (id) => request(`/about/team/${id}`, { method: "DELETE" }),

  // FAQ
  getFAQs: () => request("/faqs/all"),
  getPublishedFAQs: () => request("/faqs"),
  createFAQ: (data) => request("/faqs", { method: "POST", body: JSON.stringify(data) }),
  updateFAQ: (id, data) => request(`/faqs/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteFAQ: (id) => request(`/faqs/${id}`, { method: "DELETE" }),

  // Notifications (admin)
  getNotificationCounts: () => request("/admin/notifications/counts"),

  // Notifications (student-facing)
  getNotifications: () => request("/notifications"),
  markNotificationRead: (id) => request("/notifications/read", { method: "PUT", body: JSON.stringify({ id }) }),
  markAllNotificationsRead: () => request("/notifications/read", { method: "PUT", body: JSON.stringify({}) }),

  // Settings
  getSettings: () => request("/settings"),
  getSettingsAll: () => request("/settings/all"),
  createSetting: (data) => request("/settings", { method: "POST", body: JSON.stringify(data) }),
  updateSettings: (data) => request("/settings", { method: "PUT", body: JSON.stringify(data) }),
  updateSetting: (key, data) => request(`/settings/${encodeURIComponent(key)}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteSetting: (key) => request(`/settings/${encodeURIComponent(key)}`, { method: "DELETE" }),
};
