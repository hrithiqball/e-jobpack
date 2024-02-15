# Self Hosted Image Server

#### This is the server for the image service. It is a simple REST API that allows client to upload and retrieve images.

#### The reason of building this server is because nextjs does not support dynamic file serves. This server is built to serve the images for the nextjs app.

#### The server is built using express and multer for file upload.

#### The server is self hosted and not deployed to any cloud service.

### To run the server

1. Copy the `.env.example` file to `.env` and fill in the required fields.
2. Run `npm install` to install the dependencies.
3. Run `npm run dev` to start the development server.
4. Run `npm run build` to build the server for production.
5. Run `npm run start` to start the production server.
