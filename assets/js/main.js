/* ==========================================================================
   COWORK FITNESS — Script principal
   Navegação mobile, formulário, WhatsApp contextual e animações leves.
   ========================================================================== */

(function () {
  "use strict";

  /* ----------------------------------------------------------------------
     Configuração
     ---------------------------------------------------------------------- */

  // Preencher com o endpoint Formspree/Netlify Forms quando definido.
  // Ex.: "https://formspree.io/f/xxxxxxxx"
  // Enquanto estiver vazio, o formulário redireciona para o WhatsApp com a
     // mensagem pronta — nada se perde e a equipe recebe o contato.
  var ENDPOINT_FORMULARIO = "";

  var WHATSAPP_NUMERO = "5511940707066"; // Confirmar com a empresa antes da publicação
  var WHATSAPP_PADRAO =
    "Olá! Conheci a COWORK FITNESS pelo site e gostaria de saber mais sobre o estúdio e as opções de atendimento.";

  /* ----------------------------------------------------------------------
     Navegação mobile
     ---------------------------------------------------------------------- */

  var botaoMenu = document.querySelector("[data-botao-menu]");
  var menu = document.querySelector("[data-menu]");

  if (botaoMenu && menu) {
    botaoMenu.addEventListener("click", function () {
      var aberto = menu.classList.toggle("aberto");
      botaoMenu.setAttribute("aria-expanded", String(aberto));
      document.body.classList.toggle("menu-aberto", aberto);
    });

    document.addEventListener("keydown", function (evento) {
      if (evento.key === "Escape" && menu.classList.contains("aberto")) {
        fecharMenu();
        botaoMenu.focus();
      }
    });

    menu.addEventListener("click", function (evento) {
      if (evento.target.closest("a")) fecharMenu();
    });
  }

  function fecharMenu() {
    if (!menu || !botaoMenu) return;
    menu.classList.remove("aberto");
    botaoMenu.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-aberto");
  }

  /* ----------------------------------------------------------------------
     Links do WhatsApp com mensagem contextual
     Uso: <a data-whatsapp="mensagem personalizada" href="#">
     ---------------------------------------------------------------------- */

  function montarLinkWhatsapp(mensagem) {
    return (
      "https://wa.me/" +
      WHATSAPP_NUMERO +
      "?text=" +
      encodeURIComponent(mensagem || WHATSAPP_PADRAO)
    );
  }

  document.querySelectorAll("[data-whatsapp]").forEach(function (elemento) {
    var contexto = elemento.getAttribute("data-whatsapp");
    var mensagem =
      contexto && contexto.trim().length > 0
        ? "Olá! Conheci a COWORK FITNESS pelo site e gostaria de saber mais sobre " +
          contexto.trim() +
          "."
        : WHATSAPP_PADRAO;
    elemento.setAttribute("href", montarLinkWhatsapp(mensagem));
    elemento.setAttribute("target", "_blank");
    elemento.setAttribute("rel", "noopener");
  });

  /* ----------------------------------------------------------------------
     Formulário de contato / aula experimental
     ---------------------------------------------------------------------- */

  var formulario = document.querySelector("[data-formulario]");

  if (formulario) {
    var campoWhatsapp = formulario.querySelector("#whatsapp");
    var feedback = formulario.querySelector("[data-feedback]");

    // Máscara para telefone brasileiro
    if (campoWhatsapp) {
      campoWhatsapp.addEventListener("input", function () {
        var digits = campoWhatsapp.value.replace(/\D/g, "").slice(0, 11);
        var formato = digits;

        if (digits.length > 2) {
          formato = "(" + digits.slice(0, 2) + ") " + digits.slice(2);
        }
        if (digits.length > 7) {
          formato =
            "(" +
            digits.slice(0, 2) +
            ") " +
            digits.slice(2, 7) +
            "-" +
            digits.slice(7);
        }
        campoWhatsapp.value = formato;
      });
    }

    formulario.addEventListener("submit", function (evento) {
      evento.preventDefault();

      // Proteção anti-spam: campo oculto que humanos não preenchem
      var antispam = formulario.querySelector('[name="empresa"]');
      if (antispam && antispam.value.trim() !== "") {
        return;
      }

      if (!validarFormulario()) {
        mostrarFeedback(
          "erro",
          "Confira os campos destacados e tente novamente. Se preferir, fale com a gente pelo WhatsApp."
        );
        var primeiroInvalido = formulario.querySelector('[aria-invalid="true"]');
        if (primeiroInvalido) primeiroInvalido.focus();
        return;
      }

      var dados = {
        nome: formulario.querySelector("#nome").value.trim(),
        whatsapp: formulario.querySelector("#whatsapp").value.trim(),
        modalidade: formulario.querySelector("#modalidade").value,
        preferencia: (formulario.querySelector("#preferencia") || {}).value || "",
        mensagem: (formulario.querySelector("#mensagem") || {}).value || "",
        origem: window.location.pathname,
      };

      if (ENDPOINT_FORMULARIO) {
        enviarParaEndpoint(dados);
      } else {
        enviarViaWhatsapp(dados);
      }
    });
  }

  function validarFormulario() {
    var valido = true;

    valido = marcarCampo("#nome", function (valor) {
      return valor.trim().length >= 2;
    }) && valido;

    valido = marcarCampo("#whatsapp", function (valor) {
      var digits = valor.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 11;
    }) && valido;

    valido = marcarCampo("#modalidade", function (valor) {
      return valor !== "";
    }) && valido;

    return valido;
  }

  function marcarCampo(seletor, teste) {
    var campo = formulario.querySelector(seletor);
    if (!campo) return true;

    var ok = teste(campo.value);
    var erro = formulario.querySelector(seletor + "-erro");

    campo.setAttribute("aria-invalid", ok ? "false" : "true");
    if (erro) erro.classList.toggle("visivel", !ok);

    return ok;
  }

  function enviarParaEndpoint(dados) {
    mostrarBotaoCarregando(true);

    fetch(ENDPOINT_FORMULARIO, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(dados),
    })
      .then(function (resposta) {
        if (!resposta.ok) throw new Error("Falha no envio");
        formulario.reset();
        mostrarFeedback(
          "sucesso",
          "Solicitação enviada! A equipe da COWORK FITNESS entrará em contato pelo WhatsApp para confirmar data e horário. A aula experimental não é uma reserva confirmada até esse contato."
        );
      })
      .catch(function () {
        mostrarFeedback(
          "erro",
          "Não conseguimos enviar seu formulário agora. Por favor, fale conosco pelo WhatsApp — o link está abaixo."
        );
      })
      .finally(function () {
        mostrarBotaoCarregando(false);
      });
  }

  function enviarViaWhatsapp(dados) {
    var texto =
      "Olá! Conheci a COWORK FITNESS pelo site e gostaria de solicitar uma aula experimental.\n\n" +
      "Nome: " + dados.nome + "\n" +
      "WhatsApp: " + dados.whatsapp + "\n" +
      "Modalidade de interesse: " + dados.modalidade +
      (dados.preferencia ? "\nPreferência de dia/horário: " + dados.preferencia : "") +
      (dados.mensagem ? "\nMensagem: " + dados.mensagem : "");

    window.open(montarLinkWhatsapp(texto), "_blank", "noopener");

    mostrarFeedback(
      "sucesso",
      "Abrimos o WhatsApp com sua solicitação pronta — só enviar. A equipe retornará para confirmar data e horário. Lembrete: a solicitação não é uma reserva confirmada até o retorno da equipe."
    );
  }

  function mostrarFeedback(tipo, texto) {
    if (!feedback) return;

    feedback.className =
      "formulario__feedback formulario__feedback--" +
      (tipo === "sucesso" ? "sucesso" : "erro") +
      " visivel";
    feedback.setAttribute("role", tipo === "sucesso" ? "status" : "alert");
    feedback.querySelector("[data-feedback-texto]").textContent = texto;
  }

  function mostrarBotaoCarregando(carregando) {
    var botao = formulario.querySelector('[type="submit"]');
    if (!botao) return;
    botao.disabled = carregando;
    botao.textContent = carregando ? "Enviando..." : "Solicitar aula experimental";
  }

  /* ----------------------------------------------------------------------
     Animação leve de entrada (revelar ao rolar)
     ---------------------------------------------------------------------- */

  var elementos = document.querySelectorAll(".revelar");

  if (
    elementos.length &&
    "IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    var observador = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("visivel");
            observador.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    elementos.forEach(function (elemento) {
      observador.observe(elemento);
    });
  } else {
    elementos.forEach(function (elemento) {
      elemento.classList.add("visivel");
    });
  }

  /* ----------------------------------------------------------------------
     Ano atual no rodapé
     ---------------------------------------------------------------------- */

  document.querySelectorAll("[data-ano]").forEach(function (elemento) {
    elemento.textContent = new Date().getFullYear();
  });
})();
