const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;

export function isNewCourse(course) {
  if (!course?.created_at) return false;
  const age = Date.now() - new Date(course.created_at).getTime();
  return age >= 0 && age < FIVE_DAYS_MS;
}
