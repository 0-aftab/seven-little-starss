/* ✨ 7 Little Stars — site config (replaces the old Flask app.py settings) */
window.SITE_CONFIG = {
  // true  = SHOW her name (Irham Saba) everywhere
  // false = HIDE her name (demo/show mode, shows "You" instead)
  SHOW_NAME: true,

  // Site stays locked (after the fake loader) until this moment. Local time of the visitor.
  LOCK_UNTIL: "2026-8-22T00:00:00",

  SECRET_CODE: "Irham2210",

  // Birthday: October 22 (month is 1-12). The year is picked automatically,
  // so the countdown always points at the current year's birthday.
  BIRTHDAY_MONTH: 8,
  BIRTHDAY_DAY: 22,

  // Message board (page 8): GitHub Pages has no backend, so messages are sent
  // to a form service. Create a free form at https://formspree.io and paste the
  // endpoint here, e.g. "https://formspree.io/f/abcdwxyz". Messages then land in your email.
  MESSAGE_ENDPOINT: "https://formspree.io/f/mkjgepbg",

  BIRTHDAY_MSG: {
    title: "Aa gaye finally — Happy Birthday! 🎂",
    body:
      ",\n\n" +
      "Yeh be birthday ke din hi khulna tha .\n" +
      "Abb khul hi gaya ha toh kiya hi bolu.\n\n" +
      "Bas aaj ache se enjoy karna .\n" +
      "Khubb khana .\n\n" +
      "Khubb enjoy karna\n" +
      "Aur thore bhout nakhre be chalenge.\n\n" +
      "Happy Birthday. 🌟"
  },

  HIDDEN_STARS: [
    { id: "h1", hint: "You found the first star.It was hiding right on the notes page 👀" },
    { id: "h2", hint: "Found the second one! This was hanging out on the stars page 🌟" },
    { id: "h3", hint: "Got all three! This one was tucked away in birthday section 🎉" }
  ],

  EASTER_EGGS: [
    "Pakad liya impressive.",
    "Yeh star sirf special logon ko milta hai.",
    "Aapne shooting star click kiya.Aapki wish poori hogi. (Main guarantee nahi deta but still.) 🤞",
    "Looks like you found the easter egg i hid here. Respect. 🫡"
  ]
};
