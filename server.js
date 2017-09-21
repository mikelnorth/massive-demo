const express = require('express');
const bodyParser = require('body-parser');
const massive = require("massive")
const React = require('react');
const {renderToString} = require('react-dom/server');


const connectionString = ('postgres://mbbmsgisnpudci:54d0528ed0c187f6fef4aa05f6763e9ae69beb8619c1f596e94034ed41d9cdbe@ec2-54-235-90-125.compute-1.amazonaws.com:5432/d95bu04qmknjbe?ssl=true')

const app = express();
app.use(bodyParser.json());

const port = 3000;

const InjuriesList = ({injuries}) => 
<div>
  {injuries.map(injury => <div key={injury.id}>{injury.name}</div>)}
</div>

app.get('/', (req, res) => {
  const db = req.app.get('db');
  db.getAllInjuries().then(injuries => {
    const html = renderToString(
      <InjuriesList injuries={injuries} />
    );
    res.send(html);
  });
});


app.get('/incidents', (req, res) => {
  const db = req.app.get("db")
  const state = req.query.state;
  console.log(state)

  if (state) {
    db.getIncidentsByState([state]).then(incidents => {
      res.send(incidents)
    })
  }
  else {
    db.getAllIncidents().then(incidents => {
      res.send(incidents);
    })
  }
});


app.post('/incidents', (req, res) => {
  const incident = req.body;
  const db = req.app.get('db');

  db.createIncidents([incident.state, incident.injuryId, incident.causeId]).then( results => {
    res.send(results[0]);
  }) 
});


massive(connectionString).then(db => {
  app.set('db', db)
  app.listen(port, () => {
    console.log('Server conected on port', port);
  });
})