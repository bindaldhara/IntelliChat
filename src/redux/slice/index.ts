import { combineReducers } from "@reduxjs/toolkit";
import chatbot from "./chatbot";
import app from "./app";

const reducer = combineReducers({
  chatbot: chatbot,
  app: app,
});

export default reducer;
