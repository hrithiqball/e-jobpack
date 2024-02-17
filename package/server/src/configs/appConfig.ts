export default {
  port: Number(process.env.PORT) || 3001,
  database: {
    connection: process.env.DB_CONNECTION || '',
  },
};
