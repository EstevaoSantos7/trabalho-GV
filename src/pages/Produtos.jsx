import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Header from '../components/Header';
import axios from 'axios';

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState('');

  const api = axios.create({
    baseURL: "http://localhost:3333"
  });

  useEffect(() => {
    api.get("/produtos")
      .then(res => setProdutos(res.data))
      .catch(err => console.log("Erro ao buscar os produtos", err));
  }, [api]);

  const produtosFiltrados = busca.trim()
    ? produtos.filter(produto =>
      produto.name.toLowerCase().includes(busca.toLowerCase())
    )
    : produtos;

  return (
    <>
      <Header />
      <Link to="/cadastrar-produto">
        Adicionar um produto
      </Link>

      <input
        type="text"
        placeholder='Buscar produto'
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      {produtosFiltrados.length === 0 ? (
        <p>Nenhum produto foi cadastrado.</p>
      ) : (
        produtosFiltrados.map(produto => (
          <div key={produto.id}>
            <p>ID: {produto.id}</p>
            <p>Nome: {produto.name}</p>
            <p>Descrição: {produto.description}</p>
            <p>Preço: R$ {produto.price.toFixed(2)}</p>
            <p>Quantidade: {produto.quantity}</p>
            <p>Categoria: {produto.category?.name || 'Sem categoria'}</p>
            <img
              src={`http://localhost:3333${produto.imageUrl}`}
              alt={produto.name}
              width={100}
            />

            <Link to={`/editar-produto/${produto.id}`}>
              Editar
            </Link>
          </div>
        ))
      )}
    </>
  );
}
