import protectRoutes from './protect.routes.middleware.js';
import upload from './uploadFile.middleware.js';
import identifyUser from './identifyUser.middleware.js'

export{
    protectRoutes,
    upload,
    identifyUser
}