// The normalization layer: canonical ActivityPub objects → Tacet domain models. This is
// the boundary where protocol vocabulary (Actor, Note, Article, Create, Announce) becomes
// product vocabulary (Person, Moment). Nothing above this layer sees ActivityPub.
export { normalizePerson } from "./person";
export { normalizeObject, normalizeActivity } from "./moment";
