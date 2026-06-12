const ESTADOS_NM = {};
GEO.features.forEach(f=>ESTADOS_NM[f.properties.sigla]=f.properties.name);

const DADOS = {
  apostas:{"RR":17,"PA":17,"MT":17,"AL":15,"MA":14,"SE":14,"BA":14,"CE":8,"AC":14,"AM":13,"AP":14,"RO":15,"TO":14,"PI":13,"RN":12,"PB":12,"PE":13,"SP":12,"MG":12,"RJ":12,"ES":11,"PR":11,"RS":11,"SC":10,"GO":13,"MS":13,"DF":12},
  risco:{"AP":65.1,"AM":52.3,"MA":51.0,"RR":50.5,"PA":49.8,"DF":48.0,"MT":48.5,"AC":49.2,"RO":47.5,"TO":48.8,"PI":50.2,"CE":47.8,"RN":46.5,"PB":47.0,"PE":47.5,"AL":48.2,"SE":46.8,"BA":48.5,"RJ":47.0,"MG":45.2,"ES":44.8,"SP":44.0,"GO":47.2,"MS":46.0,"PR":44.5,"SC":43.8,"RS":44.2},
  renda:{"TO":8.2,"GO":6.5,"AM":6.4,"MA":7.8,"PA":7.1,"PI":7.4,"AP":7.0,"RR":6.8,"AC":6.6,"RO":6.2,"BA":6.7,"CE":6.3,"RN":5.9,"PB":6.0,"PE":6.1,"AL":6.4,"SE":5.8,"MT":6.0,"MS":5.7,"DF":5.5,"RJ":6.1,"MG":5.2,"ES":5.0,"SP":4.8,"PR":4.3,"RS":4.5,"SC":3.9}
};
const META = {
  apostas:{title:"Apostadores em bets (últimos 30 dias)",sub:"% da população que gastou em apostas no último mês. DataSenado, Pesquisa Panorama Político (21ª ed., 2024)"},
  risco:{title:"População adulta inadimplente",sub:"% da população adulta com nome negativado por estado. Serasa, Mapa da Inadimplência (2025-26)"},
  renda:{title:"Inadimplência das pessoas físicas",sub:"Taxa de inadimplência PF por estado. Banco Central, dez/2025"}
};

const stops=[[225,229,255],[150,166,254],[90,108,250],[59,83,254],[31,47,158]];
function cor(v){
  const t=Math.max(0,Math.min(1,v/100))*(stops.length-1);
  const i=Math.min(stops.length-2,Math.floor(t)),f=t-i,a=stops[i],b=stops[i+1];
  return `rgb(${Math.round(a[0]+(b[0]-a[0])*f)},${Math.round(a[1]+(b[1]-a[1])*f)},${Math.round(a[2]+(b[2]-a[2])*f)})`;
}
document.getElementById("scale").style.background=
  `linear-gradient(90deg,${cor(0)},${cor(35)},${cor(65)},${cor(100)})`;

const W=600,H=600;
const svg=d3.select("#mapa");
const proj=d3.geoMercator().fitSize([W,H],GEO);
const path=d3.geoPath().projection(proj);

const RANGES = {
  apostas:{min:6,max:18,unit:"% que apostou em 30 dias",fmt:v=>v+"%"},
  risco:{min:40,max:66,unit:"% adultos inadimplentes",fmt:v=>v.toFixed(1)+"%"},
  renda:{min:3.5,max:8.5,unit:"% inadimplência PF",fmt:v=>v.toFixed(1)+"%"}
};
function norm(v,ind){const r=RANGES[ind];return Math.max(0,Math.min(100,(v-r.min)/(r.max-r.min)*100));}
let indicador="apostas", selected=null;
const paths=svg.selectAll("path").data(GEO.features).enter().append("path")
  .attr("d",path)
  .attr("data-uf",d=>d.properties.sigla)
  .on("mouseenter",(e,d)=>mostrar(d.properties.sigla))
  .on("click",(e,d)=>{selected=d.properties.sigla;mostrar(selected);updateSel();});

function updateSel(){paths.classed("sel",d=>d.properties.sigla===selected);}
function fill(){paths.attr("fill",d=>cor(norm(DADOS[indicador][d.properties.sigla],indicador)));}

function render(){
  fill();
  document.getElementById("map-title").textContent=META[indicador].title;
  document.getElementById("map-sub").textContent=META[indicador].sub;
  const dados=DADOS[indicador];
  const ranked=Object.keys(dados).sort((a,b)=>dados[b]-dados[a]).slice(0,5);
  document.getElementById("tl-rows").innerHTML=ranked.map(uf=>
    `<div class="tl-row"><span class="swatch" style="background:${cor(norm(dados[uf],indicador))}"></span><span class="nm">${ESTADOS_NM[uf]}</span><span class="vl">${RANGES[indicador].fmt(dados[uf])}</span></div>`).join("");
}
function mostrar(uf){
  const a=DADOS.apostas[uf],r=DADOS.risco[uf],e=DADOS.renda[uf];
  document.getElementById("detail").innerHTML=
    `<div class="uf">${uf}</div><div class="nome">${ESTADOS_NM[uf]}</div>
     <div class="row"><span>Apostadores (30d)</span><b style="color:${cor(norm(a,'apostas'))}">${RANGES.apostas.fmt(a)}</b></div>
     <div class="row"><span>Inadimplentes (adultos)</span><b style="color:${cor(norm(r,'risco'))}">${RANGES.risco.fmt(r)}</b></div>
     <div class="row"><span>Inadimplência PF</span><b style="color:${cor(norm(e,'renda'))}">${RANGES.renda.fmt(e)}</b></div>`;
}
document.getElementById("toggle").addEventListener("click",ev=>{
  const b=ev.target.closest("button");if(!b)return;
  document.querySelectorAll("#toggle button").forEach(x=>x.classList.remove("active"));
  b.classList.add("active");indicador=b.dataset.ind;render();
});
render();
