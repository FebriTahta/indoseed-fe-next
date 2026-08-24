const axios = require('axios');
axios.get('http://localhost:8080/api/qc/methods').then(res => {
  console.log("METHODS RESPONSE:", JSON.stringify(res.data).substring(0, 300));
});
axios.get('http://localhost:8080/api/qc/parameters').then(res => {
  console.log("PARAMS RESPONSE:", JSON.stringify(res.data).substring(0, 300));
});
