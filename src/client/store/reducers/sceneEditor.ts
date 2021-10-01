import { handleActions } from "redux-actions";
import reduceReducers from "reduce-reducers";
import produce from "immer";

const initialState = {
  test: "",
  currentEntityId: null,
  currentEntityComponents: [],
  currentEntityComponentsUpdateHash: {},
  currentEntityComponentsAddList: [],
  currentEntityComponentsRemoveList: [],
  availableComponentsList: [],
  removeEntity: false,
  createEntity: false,
  cloneEntity: false,
  serialize: false,
  entities: [],
};

// const otherReducer = handleActions({
//   ACTION_NAME: produce((state, action) => {
//     state.something = action.payload;
//   })
// }, initialState);

const sceneEditorReducer = handleActions(
  {
    TEST: produce((state, action) => {
      state.test = action.payload;
    }),
    SET_CURRENT_ENTITY_ID: produce((state, action) => {
      state.currentEntityId = action.payload;
    }),
    SET_CURRENT_ENTITY_COMPONENTS: produce((state, action) => {
      state.currentEntityComponents = action.payload;
    }),
    SET_CURRENT_ENTITY_COMPONENTS_UPDATE_HASH: produce((state, action) => {
      state.currentEntityComponentsUpdateHash = action.payload;
    }),
    SET_CURRENT_ENTITY_COMPONENTS_ADD_LIST: produce((state, action) => {
      state.currentEntityComponentsAddList = action.payload;
    }),
    SET_CURRENT_ENTITY_COMPONENTS_REMOVE_LIST: produce((state, action) => {
      state.currentEntityComponentsRemoveList = action.payload;
    }),
    SET_AVAILABLE_COMPONENTS_LIST: produce((state, action) => {
      state.availableComponentsList = action.payload;
    }),
    SET_REMOVE_ENTITY: produce((state, action) => {
      state.removeEntity = action.payload;
    }),
    SET_CREATE_ENTITY: produce((state, action) => {
      state.createEntity = action.payload;
    }),
    SET_CLONE_ENTITY: produce((state, action) => {
      state.cloneEntity = action.payload;
    }),
    SET_SERIALIZE: produce((state, action) => {
      state.serialize = action.payload;
    }),
  },
  initialState
);

// export default reduceReducers(gameReducer, otherReducer, someOtherReducer);
export default reduceReducers(sceneEditorReducer);
