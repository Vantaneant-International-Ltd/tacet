import { useEffect, useState } from "react";
import { api, type Room } from "../api";
import { Link } from "../router";
import { Loading, Empty, Avatar } from "../bits";

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
        <ul className="room-cards">
          {rooms.map((room) => (
            <li key={room.slug}>
              <Link to={`/rooms/${room.slug}`} className="room-card">
                <Avatar handle={room.name} />
                <div className="room-card-body">
                  <span className="voice room-card-name">{room.name}</span>
                  {room.description && <span className="room-card-desc">{room.description}</span>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
