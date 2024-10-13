import { combineReducers } from "@reduxjs/toolkit";
import chatbot from "./chatbot";
import app from "./app";
import user from "./user";
import admin from "./admin";

const reducer = combineReducers({
  chatbot: chatbot,
  app: app,
  user: user,
  admin: admin,
});

export default reducer;
