const IDLE_TIMEOUT = 4 * 60 * 60 * 1000;

export function idleTimeout(req, res, next) {
  if (req.session?.userId && req.session?.lastActivity) {
    const elapsed = Date.now() - req.session.lastActivity;
    if (elapsed > IDLE_TIMEOUT) {
      return req.session.destroy((err) => {
        if (err) console.error("Idle timeout destroy error:", err);
        res.clearCookie("__Host-centeric.sid");
        res.clearCookie("centeric.sid");
        return res.status(401).json({ error: "Session expired due to inactivity" });
      });
    }
  }
  if (req.session) req.session.lastActivity = Date.now();
  next();
}
