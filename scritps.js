$(document).ready(function () {

    console.log("HI");
});


/* ---------- Add Content ---------- */

function addContent(idFrom, idTo){ $( "#"+idTo ).load( idFrom + "" );}

/* ---------- Contacts ---------- */
var email = "stella.orfanidis@hotmail.com";
var skype = "skype:stergianni.orfanidis?userinfo";
var twitter = "https://twitter.com/stergiann";
var linkedin = "https://www.linkedin.com/in/stergianni-orfanidis/";

/* ---------- About me ---------- */
var Education = { degree: "Computer Science Engineering", school: "School of Technology and Management of Viseu", year: "2017"}
var Experience = [
    { company: "Pessoas & Processos", time: "6 months", type: "intership", site: "http://www.pessoaseprocessos.com/home", job = ".Net Developer" }, 
    { company: "Softinsa", time: "9 months", site: "http://www.softinsa.pt/", job="Fontend developer" }];
var car = { type: "Fiat", model: "500", color: "white" };
