// Shown once, the first time someone arrives on a device, then it stays out of the way.
// Teaches the one thing newcomers from other apps need: this is a house of rooms, not a
// feed, and the format is the lens. Dismissal is a per-device UI preference (localStorage),
// not stored data.

const KEY = "tacet_onboarded";

export function hasOnboarded(): boolean {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return true; // if storage is unavailable, don't nag
  }
}

export function Onboarding({ onDone }: { onDone: () => void }) {
  function done() {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    onDone();
  }

  return (
    <div className="overlay onboarding" role="dialog" aria-label="About TACET">
      <div className="overlay-inner onboarding-inner">
        <p className="label mark">TACET</p>
        <h1 className="onboard-title">A house of rooms, not a feed.</h1>

        <div className="onboard-block">
          <p className="label">Rooms</p>
          <p className="onboard-line">
            You don't follow people here; you're in rooms with them. You choose a room by who
            is in it, not by what it's about.
          </p>
        </div>

        <div className="onboard-block">
          <p className="label">Lenses</p>
          <p className="onboard-line">
            How you see a room is your choice. Read it as a Timeline, or see it as a Grid. The
            format is the lens, not the room.
          </p>
        </div>

        <div className="onboard-block">
          <p className="label">What you can do</p>
          <p className="onboard-line">
            Reply, keep, or acknowledge with a word. A keep is yours alone. An acknowledgment
            is seen by the room, with your name — never as a number.
          </p>
        </div>

        <div className="onboard-block">
          <p className="label">What isn't here</p>
          <p className="onboard-line">
            No counts, no algorithm, no advertising, no notifications. The app never asks to be
            opened. You come when you're curious.
          </p>
        </div>

        <button className="label action" onClick={done}>
          Enter
        </button>
      </div>
    </div>
  );
}
