import Component from "../Component";

// TODO: need a finiteStateMachine as well. https://www.richardlord.net/blog/ecs/finite-state-machines-with-ash.html

// TODO: jest tests !!!!
class EntityStateMachine {
  // TODO: wip

  createState = (name: string) => {
    // TODO: ...
  };

  // TODO: this will probably live on some 'State' class as part of FSM stuff, instead of EntityStateMachine
  // add = componentName => {
  //   // TODO: add component to particular state (needs to be called on state)
  // };

  // TODO: this will probably live on some 'State' class as part of FSM stuff, instead of EntityStateMachine
  withInstance = (component: Component) => {
    // TODO: add component instance to particular state (needs to be called on state)
  };
}

export default EntityStateMachine;
