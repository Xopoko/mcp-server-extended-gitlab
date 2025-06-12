import { createApp } from './bootstrapServer';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const app = createApp();

app.listen(PORT, () => {
  console.log(`MCP server template listening on port ${PORT}`);
});
