import { suggested, communities } from "../mock";
import { PersonRow } from "../components";
import { SectionHeading, Card, Chip, Button } from "../../design/primitives";
import { Icon } from "../../design/icons";

// The gateway to the wider open social web. Directory + human recommendation, honest
// about open vs closed — never an algorithmic trending machine.
export function Discover() {
  return (
    <div className="t-screen">
      <SectionHeading
        title="Discover"
        subtitle="A door to the wider open social web. No trending, no algorithm — just people worth knowing."
      />

      <div className="t-search">
        <Icon name="search" size={19} />
        <input
          className="t-search__input"
          type="search"
          placeholder="Search people, communities, or a handle like @name@server"
          aria-label="Search the open social web"
        />
      </div>

      <section className="t-group">
        <h3 className="t-group__label">People to follow</h3>
        <div className="t-list">
          {suggested.map((p) => (
            <PersonRow key={p.id} person={p} />
          ))}
        </div>
      </section>

      <section className="t-group">
        <h3 className="t-group__label">Communities</h3>
        <div className="t-cards">
          {communities.map((c) => (
            <Card key={c.id} interactive className="t-community">
              <div className="t-community__top">
                <h4 className="t-community__name">{c.name}</h4>
                <Chip icon="globe" tone={c.server === "tacet.social" ? "accent" : "open"}>{c.server}</Chip>
              </div>
              <p className="t-community__blurb">{c.blurb}</p>
              <div className="t-community__foot">
                <span className="t-community__members">{c.members} here</span>
                <Button variant="secondary" size="sm">Visit</Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <p className="t-openweb-note">
        <Icon name="globe" size={16} />
        Tacet begins with the open social web. Closed platforms remain walled gardens
        until they open a door.
      </p>
    </div>
  );
}
