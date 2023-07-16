const express = require('express');
const app = express();
const port = 3001;

app.get('/api', (req: unknown, res: any) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export {}
