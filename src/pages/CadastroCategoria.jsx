import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../components/Header'

const api = axios.create({
  baseURL: "http://localhost:3333"
})

export default function CadastroCategoria() {
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [erro, setErro] = useState("")

  const navigate = useNavigate()

  const isValid =
    nome.trim() !== "" && descricao.trim() !== "";

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.post("categorias", {
        name: nome,
        description: descricao
      })
      navigate("/categorias")
    } catch (err) {
      setErro(err.message)
      console.log(erro);
    }
  }
  return (
    <>
      <Header />
      <form action="" onSubmit={handleSubmit}>
        <h2>Cadastro de categoria</h2>
        <label htmlFor="nome">nome</label>
        <input type="text"
          id="nome"
          placeholder="Digite um nome de categoria"
          required
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <label htmlFor="descricao">Descrição</label>
        <textarea
          name="descricao"
          id="descricao"
          value={descricao}
          placeholder="Digite uma descrição"
          onChange={(e) => setDescricao(e.target.value)}
          required
        />
        <div className="botoes">
          <button type="button"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>
          <button type="submit" disabled={!isValid} >
            Salvar
          </button>
        </div>
      </form>
    </>
  );
}
