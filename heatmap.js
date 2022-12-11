// Declaração do d3
const d3 = require('d3');

// chamada para a API
d3.json("https://dadosabertos.senado.leg.br/api/v2/senadores",
  function(error, data) {
    if (error) {
      console.log(error);
      return;
    }
    
    // mapear o JSON para retornar os partidos
    var senadoresByPartido = d3.nest()
      .key(function(d) { return d.ultimoStatus.partido.sigla; })
      .entries(data.dados);
    
    // criar os botões para cada partido
    var partidosButtons = d3.select("#chart")
      .selectAll("input")
      .data(senadoresByPartido)
      .enter()
      .append("input")
      .attr("type", "button")
      .attr("value", function(d) { return d.key; });
