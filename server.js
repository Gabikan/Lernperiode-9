const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
app.use(cors());
app.use(bodyParser.json());


app.get('/transactions', (req, res) => {
  db.all("SELECT * FROM transactions ORDER BY date DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/transactions', (req, res) => {
  const { description, amount, date } = req.body;
  db.run(
    "INSERT INTO transactions (description, amount, date) VALUES (?, ?, ?)",
    [description, amount, date],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

app.delete('/transactions/:id', (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM transactions WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});


app.listen(3000, () => {
  console.log('✅ Server läuft auf http://localhost:3000');
});
