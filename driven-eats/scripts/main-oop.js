console.log("Orientado a objetos");

class Opcao {
  constructor({ nome, imagem, descricao, preco }) {
    this.nome = nome;
    this.imagem = imagem;
    this.descricao = descricao;
    this.preco = preco;
  }
}

class Prato extends Opcao {
  constructor({ nome, imagem, descricao, preco }) {
    super({ nome, imagem, descricao, preco });
  }
}

class Bebida extends Opcao {
  constructor({ nome, imagem, descricao, preco }) {
    super({ nome, imagem, descricao, preco });
  }
}

class Sobremesa extends Opcao {
  constructor({ nome, imagem, descricao, preco }) {
    super({ nome, imagem, descricao, preco });
  }
}

class Pedido {
  constructor() {
    this.pratoSelecionado = null;
    this.bebidaSelecionada = null;
    this.sobremesaSelecionada = null;
  }

  isReadyToOrder() {
    return (
      this.pratoSelecionado &&
      this.bebidaSelecionada &&
      this.sobremesaSelecionada
    );
  }

  selectOption(option) {
    if (option instanceof Prato) {
      this.pratoSelecionado = option;
    } else if (option instanceof Bebida) {
      this.bebidaSelecionada = option;
    } else if (option instanceof Sobremesa) {
      this.sobremesaSelecionada = option;
    }
  }

  getTotalPrice() {
    return (
      this.pratoSelecionado.preco +
      this.bebidaSelecionada.preco +
      this.sobremesaSelecionada.preco
    );
  }

  enviarZap() {
    const telefoneRestaurante = 553299999999;
    const encodedText = encodeURIComponent(
      `Olá, gostaria de fazer o pedido: \n- Prato: ${
        this.pratoSelecionado.nome
      } \n- Bebida: ${this.bebidaSelecionada.nome} \n- Sobremesa: ${
        this.sobremesaSelecionada.nome
      } \nTotal: R$ ${this.getTotalPrice().toFixed(2)}`
    );

    const urlWhatsapp = `https://wa.me/${telefoneRestaurante}?text=${encodedText}`;
    window.open(urlWhatsapp);
  }
}

class View {
  constructor({ pratos, bebidas, sobremesas, pedido }) {
    this.pratos = pratos;
    this.bebidas = bebidas;
    this.sobremesas = sobremesas;
    this.pedido = pedido;
    this.btnConfirmar = document.querySelector(".confirmar");
    this.btnCancelar = document.querySelector(".cancelar");
    this.btnPedir = document.querySelector(".fazer-pedido");
    this.modal = document.querySelector(".overlay");
  }

  init() {
    const pratosContainer = document.querySelector(".opcoes.prato");
    this.pratos.forEach((prato) =>
      pratosContainer.appendChild(this.getOptionView(prato))
    );

    const bebidasContainer = document.querySelector(".opcoes.bebida");
    this.bebidas.forEach((bebida) =>
      bebidasContainer.appendChild(this.getOptionView(bebida))
    );

    const sobremesasContainer = document.querySelector(".opcoes.sobremesa");
    this.sobremesas.forEach((sobremesa) =>
      sobremesasContainer.appendChild(this.getOptionView(sobremesa))
    );

    this.btnConfirmar.addEventListener("click", () => {
      this.pedido.enviarZap();
    });

    this.btnCancelar.addEventListener("click", () => {
      this.closeOrderConfirmationModal();
    });

    this.btnPedir.addEventListener("click", () => {
      this.openOrderConfirmationModal();
    });
  }

  selectOption(optionElement, option) {
    const selectedOptionElement = document.querySelector(
      `.${option.type} .selecionado`
    );
    if (selectedOptionElement !== null) {
      selectedOptionElement.classList.remove("selecionado");
    }
    optionElement.classList.add("selecionado");

    this.pedido.selectOption(option);

    if (this.pedido.isReadyToOrder()) {
      this.enableOrderButton();
    }
  }

  getOptionView(option) {
    const view = document.createElement("div");
    view.classList.add("opcao");
    view.addEventListener("click", () => {
      this.selectOption(view, option);
    });

    view.innerHTML = `
          <img src="${option.imagem}" />
          <div class="titulo">${option.nome}</div>
          <div class="descricao">${option.descricao}</div>
          <div class="fundo">
              <div class="preco">R$ ${option.preco.toFixed(2)}</div>
              <div class="check">
                  <ion-icon name="checkmark-circle"></ion-icon>
              </div>
          </div>
      `;

    return view;
  }

  openOrderConfirmationModal() {
    this.modal.classList.remove("escondido");

    document.querySelector(".confirmar-pedido .prato .nome").innerHTML =
      this.pedido.pratoSelecionado.nome;
    document.querySelector(".confirmar-pedido .prato .preco").innerHTML =
      this.pedido.pratoSelecionado.preco.toFixed(2);

    document.querySelector(".confirmar-pedido .bebida .nome").innerHTML =
      this.pedido.bebidaSelecionada.nome;
    document.querySelector(".confirmar-pedido .bebida .preco").innerHTML =
      this.pedido.bebidaSelecionada.preco.toFixed(2);

    document.querySelector(".confirmar-pedido .sobremesa .nome").innerHTML =
      this.pedido.sobremesaSelecionada.nome;
    document.querySelector(".confirmar-pedido .sobremesa .preco").innerHTML =
      this.pedido.sobremesaSelecionada.preco.toFixed(2);

    document.querySelector(".confirmar-pedido .total .preco").innerHTML =
      this.pedido.getPrecoTotal().toFixed(2);
  }

  closeOrderConfirmationModal() {
    this.modal.classList.add("escondido");
  }

  enableOrderButton() {
    this.btnPedir.classList.add("ativo");
    this.btnPedir.disabled = false;
    this.btnPedir.innerHTML = "Fazer pedido";
  }
}

const pratos = [
  new Prato({
    nome: "Estrombelete de Frango",
    imagem: "img/frango_yin_yang.png",
    descricao: "Um pouco de batata, um pouco de salada",
    preco: 14.9,
  }),
  new Prato({
    nome: "Asa de Boi",
    imagem: "img/frango_yin_yang.png",
    descricao: "Com molho shoyu",
    preco: 14.9,
  }),
  new Prato({
    nome: "Carne de Monstro",
    imagem: "img/frango_yin_yang.png",
    descricao: "Com batata assada e farofa",
    preco: 14.9,
  }),
];

const bebidas = [
  new Bebida({
    nome: "Coquinha gelada",
    imagem: "img/coquinha_gelada.png",
    descricao: "Lata 350ml",
    preco: 4.9,
  }),
  new Bebida({
    nome: "Caldo de Cana",
    imagem: "img/coquinha_gelada.png",
    descricao: "Copo 600ml",
    preco: 4.9,
  }),
  new Bebida({
    nome: "Corote Gelado",
    imagem: "img/coquinha_gelada.png",
    descricao: "Garrafa 400ml",
    preco: 4.9,
  }),
];

const sobremesas = [
  new Sobremesa({
    nome: "Pudim",
    imagem: "img/pudim.png",
    descricao: "Gosto de doce de leite",
    preco: 7.9,
  }),
  new Sobremesa({
    nome: "Flam",
    imagem: "img/pudim.png",
    descricao: "Gosto de chocolate",
    preco: 7.9,
  }),
  new Sobremesa({
    nome: "Brigadeiro",
    imagem: "img/pudim.png",
    descricao: "3 unidades",
    preco: 7.9,
  }),
];

const pedido = new Pedido();
const view = new View({ pratos, bebidas, sobremesas, pedido });
view.init();
