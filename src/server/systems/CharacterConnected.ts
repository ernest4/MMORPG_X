import ConnectionEvent from "../../shared/components/ConnectionEvent";
import Transform from "../../shared/components/Transform";
import { Engine } from "../../shared/ecs";
import System from "../../shared/ecs/System";
import { EntityId } from "../../shared/ecs/types";
import { SparseSetItem } from "../../shared/ecs/utils/SparseSet";
import Name from "../components/Name";
import NearbyCharacters from "../components/NearbyCharacters";
import OutgoingMessage from "../components/OutgoingMessage";
import Room from "../components/Room";
import State from "../game/State";

const queryComponents = [ConnectionEvent, Name, Transform, Room, NearbyCharacters];
type ComponentsSet = [ConnectionEvent, Name, Transform, Room, NearbyCharacters];
class CharacterConnected extends System {
  private _state: State;

  constructor(engine: Engine, state: State) {
    super(engine);
    this._state = state;
  }

  start(): void {}

  update(): void {
    this.engine.query(this.createServerMessages, ...queryComponents);
  }

  destroy(): void {}

  private createServerMessages = (querySet: ComponentsSet) => {
    const [connectionEvent, name, transform, room, nearbyCharacters] = querySet;

    // TODO: future 'Entity' API sample: ...
    // const entity = this.engine.getEntity(connectionEvent.id);
    // const components = entity.getComponents(...queryComponents) as ComponentsSet;
    // OR? const components = entity.getComponents<ComponentsSet>(...queryComponents);

    let serverMessageComponents: OutgoingMessage[] = [];
    const newCharacterEntityId = connectionEvent.id;
    const messagesToInformClientOfSelf = this.messagesToInformClientOfSelf(room, name, transform);
    serverMessageComponents = [...serverMessageComponents, ...messagesToInformClientOfSelf];

    nearbyCharacters.entityIdsSet.stream(({ id: nearbyCharacterEntityId }: SparseSetItem) => {
      // ...
      const messagesToInformOthersOfClient = this.messagesToInformOthersOfClient();
      const messagesToInformClientOfOthers = this.messagesToInformClientOfOthers();

      serverMessageComponents = [
        ...serverMessageComponents,
        ...messagesToInformOthersOfClient,
        ...messagesToInformClientOfOthers,
      ];
    });

    this.engine.addComponents(...serverMessageComponents);
  };

  private messagesToInformClientOfSelf = () => {
    return [
      this.createRoomInitMessageComponent(),
      this.createEnterMessageComponent(),
      this.createPositionMessageComponent(),
    ];
  };

  private messagesToInformOthersOfClient = () => {
    //
  };

  private messagesToInformClientOfOthers = () => {
    //
  };

  private createRoomInitMessageComponent = (currentRoomName: string, toEntityId: EntityId) => {
    const { tileSizeInPx, widthInTiles, heightInTiles, tiles } = this._state.rooms[currentRoomName];
    const parsedMessage = { tileSizeInPx, widthInTiles, heightInTiles, tiles };
    return new OutgoingMessage(this.engine.generateEntityId(), parsedMessage, toEntityId);
  };

  private createEnterMessageComponent = () => {
    //
  };

  private createPositionMessageComponent = () => {
    //
  };
}

export default CharacterConnected;

//     private def handle_character_enter(query_set)
//       connection_event, name, transform, location, nearby_characters = Tuple(Component::ConnectionEvent, Component::Name, Component::Transform, Component::Location, Component::NearbyCharacters).from(query_set)
//       character_entity_id = connection_event.id

//       components = [] of Component::ServerMessage

//       # messages to inform client of client
//       components.push(map_init_message(location.current_map_name, character_entity_id))
//       components.push(enter_message(character_entity_id, name, character_entity_id))
//       components.push(position_message(character_entity_id, transform, character_entity_id))

//       nearby_characters.entity_ids_set.stream do |entity_id_item|
//         nearby_character_entity_id = entity_id_item.id
//         # messages to inform others of client
//         components.push(enter_message(character_entity_id, name, nearby_character_entity_id))
//         components.push(position_message(character_entity_id, transform, nearby_character_entity_id))

//         # messages to inform client of others
//         nearby_character_name = engine.get_component(Component::Name, nearby_character_entity_id).as Component::Name
//         nearby_character_transform = engine.get_component(Component::Transform, nearby_character_entity_id).as Component::Transform

//         components.push(enter_message(nearby_character_entity_id, nearby_character_name, character_entity_id))
//         components.push(position_message(nearby_character_entity_id, nearby_character_transform, character_entity_id))
//       end

//       engine.add_components(components)
//     end

//     private def map_init_message(current_map_name, recipient_character_entity_id)
//       Component::ServerMessage.new(
//         entity_id: engine.generate_entity_id,
//         to_entity_id: recipient_character_entity_id,
//         message: Pulse::Messages::MapInit.new(@state.maps[current_map_name])
//       )
//     end

//     private def enter_message(subject_character_entity_id, name, recipient_character_entity_id)
//       Component::ServerMessage.new(
//         entity_id: engine.generate_entity_id,
//         to_entity_id: recipient_character_entity_id,
//         message: Pulse::Messages::Enter.new(subject_character_entity_id, name.name)
//       )
//     end

//     private def position_message(subject_character_entity_id, transform, recipient_character_entity_id)
//       message = Pulse::Messages::Position.new(
//         subject_character_entity_id, transform.position.x, transform.position.y
//       )

//       Component::ServerMessage.new(
//         entity_id: engine.generate_entity_id,
//         to_entity_id: recipient_character_entity_id,
//         message: message
//       )
//     end
//   end
// end
