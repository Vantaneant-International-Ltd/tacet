import { useInView } from "./useInView";

export function FederationSection() {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  return (
    <section className="lp-section" id="lp-federation">
      <div className={"lp-inner lp-reveal" + (inView ? " is-in" : "")} ref={ref}>
        <h2 className="lp-h2">It should work like email.</h2>
        <p className="lp-lead">
          <span className="lp-lead-lines">
            <span>You have one address.</span>
            <span>Your friends can live elsewhere.</span>
            <span>Messages still arrive.</span>
            <span>People still connect.</span>
          </span>
        </p>

        <div className="lp-fed-diagram" aria-hidden="true">
          <div className="lp-fed-you">@renato@tacet.social</div>
          <div className="lp-fed-verb">connects with</div>
          <div className="lp-fed-peers">
            <span className="lp-fed-peer">@anna@mastodon.social</span>
            <span className="lp-fed-peer">@cassie@pixelfed.social</span>
            <span className="lp-fed-peer">@tobi@peertube.social</span>
          </div>
        </div>

        <p className="lp-sub" style={{ marginTop: "2.5rem" }}>
          That is what social networking was meant to be.
        </p>
      </div>
    </section>
  );
}
