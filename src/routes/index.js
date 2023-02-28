import express from "express";
import HomeControllers from "../controllers";

const routes = express()

routes.get('/home', HomeControllers.welcome)

export default routes