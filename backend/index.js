const express = require("express");
const mongoose = require("mongoose");
const User = require("./src/models/user");
const Video = require("./src/models/video");
mongoose.connect(
  "mongodb+srv://sussuday:jSwYRntfmJJyEOOV@cluster0-8ajil.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Worlds!");
});

app.post("/login", async (request, response) => {
  const { username } = request.body;

  let statusCode = 200;
  let user = await User.findOne({ username });

  if (!user) {
    user = await User.create({ username });
    statusCode = 201;
  }

  return response.status(statusCode).json({ user });
});

app.post("/videos", async (request, response) => {
  // [x] verificar so o usuario realmente existe
  // [x] se nao existe, retorna erro
  // [x] verificar se o video_url ja esta associado ao usuario
  // [x] se ja esta associado, retorna os dados do video que ja esta cadastrado
  // [x] salvar o video_url no banco
  // [x] retornar os dados do video
  
  const { url, user_id } = request.body;

  const user = await User.findOne({ _id: user_id});
  let statusCode = 200;

  if(!user) {
    return response.status(404).json({ erro: "Usuário não encontrado!"});
  }

  let video = await Video.findOne({ url, user_id});

  if(!video) {
    video = await Video.create({ user_id, url });
    statusCode = 201;
  }

  return response.status(statusCode).json({ video });
});


app.get('/videos/user/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const usuario = await User.findOne({ username });
    if(!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado"});
    }

    const videos = await Video.find({ user_id: usuario._id });
    

    return res.json({ videos });
  }
  catch(erro)
  {
    return res.status(400).json({ erro: erro });
  }
})


app.delete('/videos/:id', async (req, res) => {
  const { id } = req.params;

  try {
      await Video.findByIdAndRemove(id);
      return res.status(202).send();
  } catch(erro) {
    return res.status(400).json({ erro: "Vídeo não encontrado!"});
  }
})

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
