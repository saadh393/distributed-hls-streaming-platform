/**
 * Generates Unqiue Id for Video
 * @returns String
 */
export default function generateId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  const timeInMilisecond = new Date().getTime().toString(16).slice(6); // last few number
  let uniqueId = "";
  for (let i = 0; i < 5; i++) {
    const randomNumber = Math.floor(Math.random() * chars.length);
    uniqueId += chars[randomNumber];
    if (i == 2) {
      uniqueId += timeInMilisecond;
    }
  }

  return uniqueId;
}
