export function requireAuth(req, res, next) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    if (!roles.includes(req.session.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}

export function optionalAuth(req, res, next) {
  // session is already populated by express-session if it exists
  next();
}
