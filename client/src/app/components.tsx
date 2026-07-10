import { Avatar, Button } from "../design/primitives";
import { Icon } from "../design/icons";
import type { Person } from "./mock";
import { handle } from "./mock";

// A person's name and address. Everyone is simply "a person" — where their home
// happens to be lives quietly in the address, the way an email address does. No
// "remote" badge, no protocol; one coherent people model.
export function PersonIdentity({ person, time }: { person: Person; time?: string }) {
  return (
    <div className="t-identity">
      <span className="t-identity__name">
        {person.name}
        {person.verified && (
          <span className="t-identity__verified" title="Identity confirmed">
            <Icon name="verified" size={15} />
          </span>
        )}
      </span>
      <span className="t-identity__meta t-mono">
        {handle(person)}
        {time && <span aria-hidden="true"> · {time}</span>}
      </span>
    </div>
  );
}

// A person, with a Follow control. Following isn't wired yet (read-only milestone), so the
// control is honestly disabled ("coming soon") rather than a toggle that pretends.
export function PersonRow({ person }: { person: Person }) {
  return (
    <div className="t-personrow t-card t-card--interactive">
      <Avatar name={person.name} size={52} />
      <div className="t-personrow__body">
        <PersonIdentity person={person} />
        <p className="t-personrow__bio">{person.bio}</p>
        {person.followsYou && <span className="t-personrow__badge">Follows you</span>}
      </div>
      <Button variant="secondary" size="sm" disabled title="Coming soon">Follow</Button>
    </div>
  );
}
