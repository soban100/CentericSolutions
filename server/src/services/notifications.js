import db from "../db.js";

export async function createNotification({ type, title, body, link }) {
  try {
    await db.query(
      "INSERT INTO notifications (type, title, body, link) VALUES ($1, $2, $3, $4)",
      [type, title, body, link]
    );
  } catch (e) {
    console.error("Failed to create notification:", e.message);
  }
}
