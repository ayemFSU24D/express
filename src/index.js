import express from 'express'

const app = express()


app.get("/", (req, res) =>  {
  res.send("Backend running on Vercel ✅");
});

app.get('/api/users/:id', (_req, res) => {
  res.json({ id: _req.params.id })
})

app.use("/drug", drugRoutes);
//app.use("/auth/drug", drugRoutes);
app.use("/free/drug", drugRoutes);

export default app
