console.log("Orientado a objetos");

const pratos = [
  {
    nome: "Estrombelete de Frango",
    imagem: "img/frango_yin_yang.png",
    descricao: "Um pouco de batata, um pouco de salada",
    preco: 14.9,
  },
  {
    nome: "Asa de Boi",
    imagem: "img/frango_yin_yang.png",
    descricao: "Com molho shoyu",
    preco: 14.9,
  },
  {
    nome: "Carne de Monstro",
    imagem: "img/frango_yin_yang.png",
    descricao: "Com batata assada e farofa",
    preco: 14.9,
  },
];

const bebidas = [
  {
    nome: "Coquinha gelada",
    imagem: "img/coquinha_gelada.png",
    descricao: "Lata 350ml",
    preco: 4.9,
  },
  {
    nome: "Caldo de Cana",
    imagem: "img/coquinha_gelada.png",
    descricao: "Copo 600ml",
    preco: 4.9,
  },
  {
    nome: "Corote Gelado",
    imagem: "img/coquinha_gelada.png",
    descricao: "Garrafa 400ml",
    preco: 4.9,
  },
];

const sobremesas = [
  {
    nome: "Pudim",
    imagem: "img/pudim.png",
    descricao: "Gosto de doce de leite",
    preco: 7.9,
  },
  {
    nome: "Flam",
    imagem: "img/pudim.png",
    descricao: "Gosto de chocolate",
    preco: 7.9,
  },
  {
    nome: "Brigadeiro",
    imagem: "img/pudim.png",
    descricao: "3 unidades",
    preco: 7.9,
  },
];

const btnConfirmar = document.querySelector(".confirmar");
const btnCancelar = document.querySelector(".cancelar");
const btnPedir = document.querySelector(".fazer-pedido");

class View {
  constructor({ pratos, bebidas, sobremesas, pedido }) {
    this.pratos = pratos;
    this.bebidas = bebidas;
    this.sobremesas = sobremesas;
    this.pedido = pedido;
  }

  init() {
    const pratosContainer = document.querySelector(".opcoes.prato");
    this.pratos.forEach((prato) =>
      pratosContainer.appendChild(this.createOptionView(prato, "prato"))
    );

    const bebidasContainer = document.querySelector(".opcoes.bebida");
    this.bebidas.forEach((bebida) =>
      bebidasContainer.appendChild(this.createOptionView(bebida, "bebida"))
    );

    const sobremesasContainer = document.querySelector(".opcoes.sobremesa");
    this.sobremesas.forEach((sobremesa) =>
      sobremesasContainer.appendChild(
        this.createOptionView(sobremesa, "sobremesa")
      )
    );

    btnConfirmar.addEventListener("click", () => {
      this.pedido.confirmar();
    });

    btnCancelar.addEventListener("click", () => {
      this.closeOrderModal();
    });

    btnPedir.addEventListener("click", () => {
      this.showOrderModal();
    });
  }

  createOptionView(option, optionType) {
    const view = document.createElement("div");
    view.classList.add("opcao");
    view.addEventListener("click", () =>
      this.selectOption(view, option, optionType)
    );
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

  selectOption(element, option, optionType) {
    const selecionado = document.querySelector(`.${optionType} .selecionado`);

    if (selecionado !== null) {
      selecionado.classList.remove("selecionado");
    }
    element.classList.add("selecionado");

    this.pedido[optionType] = option;
    if (this.pedido.isReady()) this.enableOrderButton();
  }

  enableOrderButton() {
    btnPedir.classList.add("ativo");
    btnPedir.disabled = false;
    btnPedir.innerHTML = "Fazer pedido";
  }

  showOrderModal() {
    const modal = document.querySelector(".overlay");
    modal.classList.remove("escondido");

    document.querySelector(".confirmar-pedido .prato .nome").innerHTML =
      this.pedido.prato.nome;
    document.querySelector(".confirmar-pedido .prato .preco").innerHTML =
      this.pedido.prato.preco.toFixed(2);

    document.querySelector(".confirmar-pedido .bebida .nome").innerHTML =
      this.pedido.bebida.nome;
    document.querySelector(".confirmar-pedido .bebida .preco").innerHTML =
      this.pedido.bebida.preco.toFixed(2);

    document.querySelector(".confirmar-pedido .sobremesa .nome").innerHTML =
      this.pedido.sobremesa.nome;
    document.querySelector(".confirmar-pedido .sobremesa .preco").innerHTML =
      this.pedido.sobremesa.preco.toFixed(2);

    document.querySelector(".confirmar-pedido .total .preco").innerHTML =
      this.pedido.getPrecoTotal().toFixed(2);
  }

  closeOrderModal() {
    const modal = document.querySelector(".overlay");
    modal.classList.add("escondido");
  }
}

class Pedido {
  constructor() {
    this.prato = null;
    this.bebida = null;
    this.sobremesa = null;
  }

  getPrecoTotal() {
    return this.prato.preco + this.bebida.preco + this.sobremesa.preco;
  }

  isReady() {
    return this.prato && this.bebida && this.sobremesa;
  }

  confirmar() {
    const telefoneRestaurante = 553299999999;
    const encodedText = encodeURIComponent(
      `Olá, gostaria de fazer o pedido: \n- Prato: ${
        this.prato.nome
      } \n- Bebida: ${this.bebida.nome} \n- Sobremesa: ${
        this.sobremesa.nome
      } \nTotal: R$ ${this.getPrecoTotal().toFixed(2)}`
    );

    const urlWhatsapp = `https://wa.me/${telefoneRestaurante}?text=${encodedText}`;
    window.open(urlWhatsapp);
  }
}

const pedido = new Pedido();
const view = new View({ pratos, bebidas, sobremesas, pedido });
view.init();
