// Cardápio Digital · Dupla: Ana Larissa e Ana Karla - ADS.N3

// Cardápio Digital
const texto = `[
  {"id": 1, "nome": "Coxinha", "preco": 5, "categoria": "salgado"},
  {"id": 2, "nome": "Pastel de queijo", "preco": 8, "categoria": "salgado"},
  {"id": 3, "nome": "Esfirra de carne", "preco": 6, "categoria": "salgado"},
  {"id": 4, "nome": "Cuscuz com ovo", "preco": 9, "categoria": "salgado"},
  {"id": 5, "nome": "Açaí 500 ml", "preco": 18, "categoria": "doce"},
  {"id": 6, "nome": "Bolo de rolo", "preco": 7, "categoria": "doce"},
  {"id": 7, "nome": "Tapioca de coco", "preco": 8, "categoria": "doce"},
  {"id": 8, "nome": "Suco de caju", "preco": 6, "categoria": "bebida"},
  {"id": 9, "nome": "Caldo de cana", "preco": 5, "categoria": "bebida"},
  {"id": 10, "nome": "Café com leite", "preco": 4, "categoria": "bebida"}
]`

const cardapio = JSON.parse(texto)
const lista = document.querySelector('#cardapio')
const inputBusca = document.querySelector('#busca')
const containerCarrinho = document.querySelector('#carrinho')
const totalElemento = document.querySelector('#total')

let carrinho = JSON.parse(localStorage.getItem('carrinhoCardapio')) || []

// 1. Renderizar o cardápio
function renderizar(itens) {
  if (!lista) return
  lista.innerHTML = ''

  for (const item of itens) {
    const divItem = document.createElement('div')
    divItem.classList.add('item-cardapio')

    const spanInfo = document.createElement('span')
    spanInfo.textContent = item.nome + ' - R$ ' + item.preco.toFixed(2)

    const botao = document.createElement('button')
    botao.textContent = '+'
    botao.dataset.id = item.id

    divItem.appendChild(spanInfo)
    divItem.appendChild(botao)
    lista.appendChild(divItem)
  }
}

// 3 e 4. Atualizar o carrinho por quantidade
function atualizarCarrinho() {
  if (!containerCarrinho) return

  containerCarrinho.innerHTML = ''
  let total = 0

  if (carrinho.length === 0) {
    containerCarrinho.textContent = 'Carrinho vazio'
  } else {
    for (const item of carrinho) {
      const qtd = item.quantidade || 1
      const subtotal = item.preco * qtd
      total += subtotal

      const divItem = document.createElement('div')
      divItem.classList.add('item-cardapio')

      const spanInfo = document.createElement('span')
      spanInfo.textContent = `${qtd}x ${item.nome} - R$ ${subtotal.toFixed(2)}`

      const botaoRemover = document.createElement('button')
      botaoRemover.textContent = 'X'
      botaoRemover.dataset.id = item.id
      botaoRemover.classList.add('btn-remover')

      divItem.appendChild(spanInfo)
      divItem.appendChild(botaoRemover)
      containerCarrinho.appendChild(divItem)
    }
  }

  if (totalElemento) {
    totalElemento.textContent = 'R$ ' + total.toFixed(2)
  }

  localStorage.setItem('carrinhoCardapio', JSON.stringify(carrinho))
}


renderizar(cardapio)
atualizarCarrinho()

// 2. Busca 
if (inputBusca) {
  inputBusca.addEventListener('input', (evento) => {
    const textoDigitado = evento.target.value.toLowerCase()

    const itensFiltrados = cardapio.filter(item =>
      item.nome.toLowerCase().includes(textoDigitado)
    )

    renderizar(itensFiltrados)
  })
}


if (lista) {
  lista.addEventListener('click', (evento) => {
    if (evento.target.tagName === 'BUTTON') {
      const idItem = Number(evento.target.dataset.id)
      const itemEncontrado = cardapio.find(item => item.id === idItem)

      if (itemEncontrado) {
        const indexExistente = carrinho.findIndex(item => item.id === idItem)

        if (indexExistente !== -1) {
          carrinho[indexExistente].quantidade = (carrinho[indexExistente].quantidade || 1) + 1
        } else {
          carrinho.push({ ...itemEncontrado, quantidade: 1 })
        }

        atualizarCarrinho()
      }
    }
  })
}


if (containerCarrinho) {
  containerCarrinho.addEventListener('click', (evento) => {
    if (evento.target.classList.contains('btn-remover')) {
      const idItem = Number(evento.target.dataset.id)
      const index = carrinho.findIndex(item => item.id === idItem)

      if (index !== -1) {
        if (carrinho[index].quantidade > 1) {
          carrinho[index].quantidade--
        } else {
          carrinho.splice(index, 1)
        }
        atualizarCarrinho()
      }
    }
  })
}

// 5. Pedido 
const formPedido = document.querySelector('#pedido')

if (formPedido) {
  formPedido.addEventListener('submit', (evento) => {
    evento.preventDefault()

    const inputNome = document.querySelector('#nome')
    const inputWhatsapp = document.querySelector('#zap')

    if (inputNome.value.trim() === '' || inputWhatsapp.value.trim() === '') {
      alert('Por favor, preencha o seu nome e WhatsApp!')
      return
    }

    if (carrinho.length === 0) {
      alert('O seu carrinho está vazio!')
      return
    }

    alert(`Pedido confirmado, ${inputNome.value}! O seu pedido foi enviado com sucesso.`)

    carrinho = []
    localStorage.removeItem('carrinhoCardapio')
    atualizarCarrinho()
    formPedido.reset()
  })
}