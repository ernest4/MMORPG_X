import { Engine } from "../../shared/ecs";
import System from "../../shared/ecs/System";
import WebSocket, { GUEST_UID_PREFIX } from "../components/WebSocket";
import ConnectionEvent from "../../shared/components/ConnectionEvent";
import { EntityId } from "../../shared/ecs/types";
import Component from "../../shared/ecs/Component";
import Character from "../../shared/components/Character";
import Name from "../../shared/components/Name";
import HitPoints from "../../shared/components/HitPoints";
import Room from "../components/Room";
import Speed from "../components/Speed";
import PhysicsBody from "../components/PhysicsBody";
import Transform from "../../shared/components/Transform";
import { DEFAULT_ROOM_NAME } from "../game/State";
import Drifter from "../../shared/components/characterTypes/Drfiter";

class CharacterDeserializer extends System {
  constructor(engine: Engine) {
    super(engine);
  }

  start(): void {}

  update(): void {
    this.engine.query(this.createCharacterComponents, ConnectionEvent, WebSocket);
  }

  destroy(): void {}

  private createCharacterComponents = ([_, webSocket]: [ConnectionEvent, WebSocket]) => {
    let characterComponents: Component[] = [];
    if (this.isGuest(webSocket.websocket.uid)) {
      characterComponents = this.createGuestCharacterComponents(webSocket.id);
    } else {
      characterComponents = this.createDBCharacterComponents(webSocket.id);
    }
    this.engine.addComponents(...characterComponents);
  };

  private isGuest = (uid: string): boolean => uid.toLowerCase().startsWith(GUEST_UID_PREFIX);

  // TODO: ...tweak?
  private createGuestCharacterComponents = (entityId: EntityId): Component[] => {
    return [
      new Character(entityId),
      new Drifter(entityId),
      new Name(entityId, `Name_${entityId}`),
      new HitPoints(entityId, 100),
      new Room(entityId, DEFAULT_ROOM_NAME),
      new Speed(entityId, 1000),
      new PhysicsBody(entityId),
      new Transform(entityId, { x: 0, y: 0, z: 0 }),
    ];
  };

  // TODO: fetch from DB
  private createDBCharacterComponents = (entityId: EntityId): Component[] => {
    return [];
  };
}

export default CharacterDeserializer;

// reference fromm crystal engine, bulk DB access...
// private def create_characters_components
//   clients = [] of Component::Client
//   engine.query(Component::ConnectionEvent, Component::Client) do |query_set|
//     connection_event, client = Tuple(Component::ConnectionEvent, Component::Client).from(query_set)
//     clients.push(client)
//   end
//   # uids = clients.map(&.uid)
//   uid_to_entity_id_hash = clients.map { |client| [client.uid, client.id] }.to_h
//   # # TODO: move info Fiber(s) maybe ?? ... need to benchmark
//   uids = uid_to_entity_id_hash.keys
//   user_id_to_uid_hash = ::User.where { _uid.in(uids) }.pluck(:id, :uid).to_h
//   user_ids = user_id_to_uid_hash.keys
//   characters = ::Character.where { _user_id.in(user_ids) }
//   # characters_data = characters.pluck(:name, :current_map, ...) # more efficient ??

//   characters.each do |character|
//     uid = user_id_to_uid_hash[character.user_id]
//     entity_id = uid_to_entity_id_hash[uid].as Int32
//     character_components = create_character_components(entity_id, character)
//     engine.add_components(character_components)
//   end
// end

// private def create_character_components(entity_id, character)
//   [
//       Component::Character.new(entity_id: entity_id),
//       Component::Name.new(entity_id: entity_id, name: character.name),
//       Component::Health.new(entity_id: entity_id, points: 100), # TODO: add points to and load points from, the DB
//       Component::Location.new(entity_id: entity_id, current_map_name: character.current_map),
//       Component::Speed.new(entity_id: entity_id, units: character.speed),
//       Component::PhysicsBody.new(entity_id: entity_id),
//       Component::Transform.new(
//       entity_id: entity_id,
//       position_x: character.last_x.to_f32,
//       position_y: character.last_y.to_f32,
//     )
//   ]
// end
