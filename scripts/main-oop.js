console.log("Orientado a objetos");

class Pedido {
  constructor() {
    this.prato = null;
    this.bebida = null;
    this.sobremesa = null;
  }

  verificar() {
    if (this.prato && this.bebida && this.sobremesa) {
      btnPedir.classList.add("ativo");
      btnPedir.disabled = false;
      btnPedir.innerHTML = "Fazer pedido";
    }
  }

  getPrecoTotal() {
    return this.prato.preco + this.bebida.preco + this.sobremesa.preco;
  }

  pedir() {
    const modal = document.querySelector(".overlay");
    modal.classList.remove("escondido");

    document.querySelector(".confirmar-pedido .prato .nome").innerHTML =
      this.prato.nome;
    document.querySelector(".confirmar-pedido .prato .preco").innerHTML =
      this.prato.preco.toFixed(2);

    document.querySelector(".confirmar-pedido .bebida .nome").innerHTML =
      this.bebida.nome;
    document.querySelector(".confirmar-pedido .bebida .preco").innerHTML =
      this.bebida.preco.toFixed(2);

    document.querySelector(".confirmar-pedido .sobremesa .nome").innerHTML =
      this.sobremesa.nome;
    document.querySelector(".confirmar-pedido .sobremesa .preco").innerHTML =
      this.sobremesa.preco.toFixed(2);

    document.querySelector(".confirmar-pedido .total .preco").innerHTML =
      this.getPrecoTotal().toFixed(2);
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

  cancelar() {
    const modal = document.querySelector(".overlay");
    modal.classList.add("escondido");
  }
}

const pedido = new Pedido();

class Opcao {
  constructor(opcao, tipo) {
    this.tipo = tipo;
    this.nome = opcao.nome;
    this.imagem = opcao.imagem;
    this.descricao = opcao.descricao;
    this.preco = opcao.preco;
  }

  createView() {
    const view = document.createElement("div");
    view.classList.add("opcao");
    view.addEventListener("click", this.select.bind(this));
    view.innerHTML = `
      <img src="${this.imagem}" />
      <div class="titulo">${this.nome}</div>
      <div class="descricao">${this.descricao}</div>
      <div class="fundo">
      <div class="preco">R$ ${this.preco.toFixed(2)}</div>
      <div class="check">
      <ion-icon name="checkmark-circle"></ion-icon>
      </div>
      </div>
    `;

    this.view = view;
  }

  select() {
    const selecionado = document.querySelector(`.${this.tipo} .selecionado`);
    if (selecionado !== null) {
      selecionado.classList.remove("selecionado");
    }
    this.view.classList.add("selecionado");

    pedido[this.tipo] = { nome: this.nome, preco: this.preco };
    pedido.verificar();
  }
}

const btnConfirmar = document.querySelector(".confirmar");
const btnCancelar = document.querySelector(".cancelar");
const btnPedir = document.querySelector(".fazer-pedido");

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

const pratosContainer = document.querySelector(".opcoes.prato");
pratos.forEach((prato) => {
  const opcao = new Opcao(prato, "prato");
  opcao.createView();
  pratosContainer.appendChild(opcao.view);
});
const bebidasContainer = document.querySelector(".opcoes.bebida");
bebidas.forEach((bebida) => {
  const opcao = new Opcao(bebida, "bebida");
  opcao.createView();
  bebidasContainer.appendChild(opcao.view);
});
const sobremesasContainer = document.querySelector(".opcoes.sobremesa");
sobremesas.forEach((sobremesa) => {
  const opcao = new Opcao(sobremesa, "sobremesa");
  opcao.createView();
  sobremesasContainer.appendChild(opcao.view);
});

btnConfirmar.addEventListener("click", () => {
  pedido.confirmar();
});

btnCancelar.addEventListener("click", () => {
  pedido.cancelar();
});

btnPedir.addEventListener("click", () => {
  pedido.pedir();
});
