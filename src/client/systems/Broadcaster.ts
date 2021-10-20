import { Engine } from "../../shared/ecs";
import System from "../../shared/ecs/System";
import Writer from "../../shared/messages/schema/Writer";
import { QuerySet } from "../../shared/ecs/types";
import OutMessage from "../../shared/components/OutMessage";

class Broadcaster extends System {
  private _webSocket: WebSocket;

  constructor(engine: Engine, webSocket: WebSocket) {
    super(engine);
    this._webSocket = webSocket;
  }

  start(): void {}

  update(): void {
    this.engine.query(this.broadcast, OutMessage);

    // Taken from crystal implementation....
    // # TODO: activate & test more bandwidth efficient option
    // # entity_messages_hash = prepare_lists
    // # broadcast(entity_messages_hash)
  }

  destroy(): void {}

  private broadcast = (querySet: QuerySet) => {
    const [outMessage] = querySet as [OutMessage<any>];
    const binaryMessage = Writer.messageComponentToBinary(outMessage);
    this._webSocket.send(binaryMessage);
    this.engine.removeComponent(outMessage);
  };

  // Taken from crystal implementation....
  // # # TODO: bunch different messages to same client into single message blob, more efficient
  // # # than sending messages one by one
  // # private def prepare_lists
  // #   entity_messages_hash = {} of Int32 => Array(Pulse::Messages::Base)

  // #   engine.query(ServerMessage) do |query_set|
  // #     server_message = query_set.first

  // #     if entity_messages_hash[server_message.to_entity_id].nil?
  // #       entity_messages_hash[server_message.to_entity_id] = [server_message.message]
  // #     else
  // #       entity_messages_hash[server_message.to_entity_id].push(server_message.message)
  // #     end

  // #     engine.remove_component(server_message)
  // #   end

  // #   entity_messages_hash
  // # end

  // # private def broadcast(entity_messages_hash)
  // #   entity_messages_hash.each do |entity_id, message_list|
  // #     # NOTE: combining lots of small messages into 1 blob should be more efficient
  // #     messages_blob = [] of UInt8

  // #     message_list.map do |message|
  // #       messages_blob += message.to_slice#.to_a
  // #     end

  // #     send(entity_id, messages_blob)
  // #   end
  // # end

  // # private def send(client_entity_id, serialized_message)
  // #   recipient_client = engine.get_component(Client, client_entity_id)
  // #   recipient_client.socket.send(serialized_message)
  // # end
}

export default Broadcaster;
