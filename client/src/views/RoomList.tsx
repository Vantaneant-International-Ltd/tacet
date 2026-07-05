import { useEffect, useState } from "react";
import { api, type Room } from "../api";
import { Link } from "../router";
import { Loading, Empty } from "../bits";

export function RoomList() {
  const [rooms, setRooms] = useState<Room[] | null>(null);

  useEffect(() => {
    api.rooms().then((r) => setRooms(r.rooms)).catch(() => setRooms([]));
  }, []);

  if (!rooms) return <Loading />;

  return (
    <section className="rooms">
      <p className="label heading">Rooms</p>
      {rooms.length === 0 ? (
        <Empty>No rooms yet.</Empty>
      ) : (
        <ul className="room-list">
          {rooms.map((room) => (
            <li key={room.slug}>
              <Link to={`/rooms/${room.slug}`} className="room-row">
                <span className="voice room-name">{room.name}</span>
                {room.description && <span className="room-desc">{room.description}</span>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
