var selecionados = new Array();

function atualizarListaEscolhidos() {
	var identificacao = document.querySelector("div#identificacao");
	var escolha = identificacao.querySelector("p#escolha");
	escolha.innerHTML = "";
	escolha.appendChild(document.createTextNode("Você escolheu: "));
	for (var i=0; i < selecionados.length; i++) {
		if (i > 0) {
			escolha.appendChild(document.createTextNode(" / "));
		};
		escolha.appendChild(document.createTextNode(selecionados[i]));
		var remover_presente = document.createElement("a");
		remover_presente.className = "fa fa-trash";
		remover_presente.addEventListener("click", function(event) {
			selecionados.splice(selecionados.indexOf(event.target.previousSibling.textContent), 1);
			atualizarListaEscolhidos();
		});
		escolha.appendChild(remover_presente);
	};
	var presentes = document.querySelectorAll("div#presentes div");
	for (var i=0; i < presentes.length; i++) {
		if (selecionados.indexOf(presentes[i].innerHTML) != -1) {
			presentes[i].className = "presente selecionado";
		} else {
			presentes[i].className = "presente";
		};
	};
};

function selecionarPresente(presente) {
	if (selecionados.indexOf(presente.innerHTML) != -1) {
		return;
	};
	var identificacao = document.querySelector("div#identificacao");
	identificacao.style.left = "calc(10% - 10px)";
	selecionados.push(presente.innerHTML);
	atualizarListaEscolhidos();
	var shadow = document.createElement("span");
	shadow.id = "shadow";
	shadow.style.backgroundColor = "black";
	shadow.style.position = "fixed";
	shadow.style.top = 0;
	shadow.style.left = 0;
	shadow.style.width = "100%";
	shadow.style.height = "100%";
	shadow.style.opacity = 0.6;
	shadow.style.zIndex = 1;
	document.body.appendChild(shadow);
	var cancelar = identificacao.querySelector("a#cancelar");
	cancelar.addEventListener("click", function() {
		document.body.removeChild(shadow);
		identificacao.style.left = "100%";
		document.body.style.position = "static";
	});
	document.body.style.position = "fixed";
};

function escolherMais() {
	var identificacao = document.querySelector("div#identificacao");
	identificacao.style.left = "100%";
	var shadow = document.querySelector("span#shadow");
	document.body.removeChild(shadow);
	document.body.style.position = "static";
};

function validarNome() {
	var nome = document.querySelector("input#nome");
	if (nome.value.length < 6) {
		nome.style.color = "red";
		return false;
	};
	nome.style.color = "";
	return true;
};

function validarEmail() {
	var email = document.querySelector("input#email");
	if (/.+@.+\..+/.test(email.value)) {
		email.style.color = "";
		return true;
	};
	email.style.color = "red";
	return false;
};

function finalizar() {
	if (!validarNome() | !validarEmail()) {
		return;
	};
	var identificacao = document.querySelector("div#identificacao");
	identificacao.style.left = "-100%";
	var nome = identificacao.querySelector("input#nome").value;
	var email = identificacao.querySelector("input#email").value;
	var vou = identificacao.querySelector("input#vou").checked;
	var acompanhantes = identificacao.querySelector("input#acompanhantes").value;
	var recado = identificacao.querySelector("textarea#recado").value;
	var registro = selecionados.map(function(selecionado) {
		return selecionado.replace(/\n/g, "");
	}).join("|") + ":" + nome + ":" + email + ":" + vou + ":" + acompanhantes + ":" + recado;
	var loading = document.querySelector("i#loading");
	var request = new XMLHttpRequest();
	request.addEventListener("readystatechange", function(event) {
		if (event.target.readyState == 4 && event.target.status == 201) {
			loading.style.display = "none";
			var obrigado = document.querySelector("div#obrigado");
			obrigado.style.left = "calc(10% - 10px)";
			var vou = identificacao.querySelector("input#vou");
			var mensagem = obrigado.querySelector("p#mensagem");
			if (vou.checked) {
				mensagem.innerHTML = "Não se esqueça de comparecer, " + nome + ". Contamos com a sua presença! Desde já, agradecemos.";
			} else {
				mensagem.innerHTML = "É uma pena que não poderá comparecer, " + nome + ". Caso mude de ideia, por favor, nos avise. Desde já, agradecemos.";
			};
		};
	});
	request.open("POST", "/cha/confirma");
	request.send(registro);
	loading.style.display = "initial";
	return;
};
