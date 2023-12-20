import express from 'express';
import Mot from './models/Mot.js';

const app = express();
app.use(express.urlencoded({ extended: true }));

const mots = await Mot.loadMany();
var cote = 'pas repondu';
var seed = Math.random() * mots.length | 0;


app.get("/", async function (req, res) {
  const mots = await Mot.loadMany();
  var mot_actuel = mots[seed];
  var mot_precedent = mot_actuel;
  res.render('principal.ejs', { mot_precedent: mot_precedent, mot_actuel: mot_actuel, cote: cote });
});

app.post("/repondre", async function (req, res) {
  const mots = await Mot.loadMany();
  var mot_precedent = mots[seed];
  var proposition = req.body.proposition;
  cote = 'faux';
  const id = mot_precedent.id_mot;
  const mot_modifier = await Mot.load({ id_mot: id })
  console.log(mot_modifier);
  if (proposition == mot_precedent.mot_fr) {
    mot_modifier.essai = mot_precedent.essai + 1;
    mot_modifier.juste = mot_precedent.juste + 1;
    await mot_modifier.save();
    cote = 'juste';
  }
  else {
    mot_modifier.essai = mot_precedent.essai + 1;
    await mot_modifier.save();
  }
  seed = Math.random() * mots.length | 0;
  const mot_actuel = mots[seed];
  res.render('principal.ejs', { mot_precedent: mot_precedent, mot_actuel: mot_actuel, cote: cote });
});

app.get("/vocabulaire", async function (req, res) {
  const mots = await Mot.loadMany();
  res.render('vocabulaire.ejs', { mots: mots });
});

app.post("/vocabulaire/add", async function (req, res) {
  const mot = new Mot();
  mot.mot_en = req.body.word;
  mot.mot_fr = req.body.translation;
  console.log(mot.mot_fr);
  await mot.save();
  res.redirect('/vocabulaire');
});


app.get("/delete/:id_mot", async function (req, res) {
  await Mot.delete({ id_mot: req.params.id_mot });
  res.redirect('/vocabulaire');
});


app.listen(3000, function () {
  console.log('Server is running on port 3000');
});

