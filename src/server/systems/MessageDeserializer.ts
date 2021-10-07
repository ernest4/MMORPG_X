import { Engine } from "../../shared/ecs";
import Buffer from "../../shared/utils/buffer";
import System from "../../shared/ecs/System";
import WebSocket from "../components/WebSocket";
import uWS from "uWebSockets.js";
import { EntityId } from "../../shared/ecs/types";
import WebSocketInitEvent from "../components/WebSocketInitEvent";
import MessageEvent from "../components/MessageEvent";

class MessageDeserializer extends System {
  constructor(engine: Engine) {
    super(engine);
  }

  start(): void {}

  update(): void {
    // this.engine.removeComponentsOfClass(MessageEvent);
    // this.createClientMessageEvents();
  }

  destroy(): void {}

  // private createClientMessageEvents = () => {
  //   this._messages_buffer.process(({ fromEntityId, binaryMessage }) => {
  //     const entityId = this.engine.generateEntityId();
  //     const clientMessageEvent = new MessageEvent(entityId, fromEntityId, binaryMessage);
  //     this.engine.addComponents(clientMessageEvent);
  //   });
  // };
}

export default MessageDeserializer;


module Pulse
  module Ecs
    module Systems
      class MessageDeserializer < Fast::ECS::System
        def initialize
          # ...
        end

        def start
          # ...
        end

        def update
          remove_message_components
          create_message_components
        end

        def destroy
          # TODO: ...
        end

        MESSAGE_COMPONENT_CLASSES = {
          Pulse::Messages::Move.to_s => Component::ClientMoveMessage,
        }

        private def remove_message_components
          MESSAGE_COMPONENT_CLASSES.values.each do |message_component_class|
            engine.query(message_component_class) do |query_set|
              message_component = query_set.first
              engine.remove_component(message_component)
            end
          end
        end

        private def create_message_components
          engine.query(Component::ClientMessageEvent) do |query_set|
            client_message_event = query_set.first.as Component::ClientMessageEvent
            
            message = Pulse::Messages::Resolver.resolve(client_message_event.binary_message)
            # TODO: move out into helper class ? resolver ?
            message_component = MESSAGE_COMPONENT_CLASSES[message.class.to_s].new(
              entity_id: engine.generate_entity_id,
              from_entity_id: client_message_event.from_entity_id,
              message: message
            )
            engine.add_component(message_component)
          end
        end
      end
    end
  end
end