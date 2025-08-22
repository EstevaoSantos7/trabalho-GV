import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import Header from "../components/Header";
import style from "../styles/editarPro.module.css";

import { FaRegTrashCan } from "react-icons/fa6";
import { LuSave } from "react-icons/lu";

const api = axios.create({
  baseURL: "http://localhost:3333",
});

export default function EditarProduto() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [quantidade, setQuantidade] = useState(0);
  const [imagemFile, setImagemFile] = useState(null);
  const [imagemUrlAtual, setImagemUrlAtual] = useState("");
  const [erro, setErro] = useState("");
  const [uploading, setUploading] = useState(false);

  const isValid =
    nome.trim() !== "" &&
    descricao.trim() !== "" &&
    preco !== "" &&
    (imagemFile !== null || imagemUrlAtual !== "") &&
    !isNaN(parseFloat(preco));

  // Buscar produto
  useEffect(() => {
    async function carregarProduto() {
      try {
        const resProduto = await api.get(`/produtos/${id}`);
        const produto = resProduto.data;

        setNome(produto.name);
        setDescricao(produto.description);
        setPreco(produto.price);
        setQuantidade(produto.quantity);
        setImagemUrlAtual(produto.imageUrl);
      } catch (err) {
        setErro("Erro ao buscar produto.");
      }
    }

    carregarProduto();
  }, [id]);

  // Editar produto
  async function editarProduto(e) {
    e.preventDefault();

    let fileToSend = imagemFile;

    // Reusar imagem atual, se não selecionar nova
    if (!imagemFile && imagemUrlAtual) {
      try {
        const response = await fetch(`http://localhost:3333${imagemUrlAtual}`);
        const blob = await response.blob();
        const fileName = imagemUrlAtual.split("/").pop();
        fileToSend = new File([blob], fileName, { type: blob.type });
      } catch (err) {
        console.error("Erro ao obter imagem atual:", err);
        setErro("Erro ao preparar imagem atual para envio.");
        return;
      }
    }

    if (!fileToSend) {
      alert("Erro: nenhuma imagem disponível para envio.");
      return;
    }

    const formData = new FormData();
    formData.append("image", fileToSend);
    formData.append("name", nome);
    formData.append("description", descricao);
    formData.append("price", preco);
    formData.append("quantity", quantidade);

    try {
      setUploading(true);
      await api.patch(`/produtos/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/produtos");
    } catch (err) {
      console.error("Erro ao editar produto:", err);
      setErro("Erro ao editar produto.");
    } finally {
      setUploading(false);
    }
  }

  // Deletar produto
  async function deletarProduto() {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;
    try {
      await api.delete(`/produtos/${id}`);
      navigate("/produtos");
    } catch (err) {
      setErro("Erro ao deletar produto.");
    }
  }

  if (erro?.response?.status === 404) {
    return <h1>Produto não encontrado</h1>;
  }

  return (
    <>
      <Header />
      <div className={style.containerTudo}>
        <div className={style.containerEditar}>
          <form onSubmit={editarProduto}>
            <h2>Editar Produto</h2>

            <div className={style.gridEditar}>
              <div className={style.nomeDiv}>
                <label className={style.label} htmlFor="nome">Nome</label>
                <input
                  className={style.nome}
                  type="text"
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>
              <div className={style.imageDiv}>
                <label className={style.label} htmlFor="imagem">Atualizar imagem</label>
                <input
                  className={style.imagem}
                  type="file"
                  id="imagem"
                  accept="image/*"
                  onChange={(e) => setImagemFile(e.target.files[0])}
                />
              </div>

              <div className={style.descDiv}>
                <label className={style.label} htmlFor="descricao">Descrição</label>
                <textarea
                  className={style.area}
                  id="descricao"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  required
                />
              </div>

              <div className={style.precoDiv}>
                <label className={style.label} htmlFor="preco">Preço</label>
                <input
                  className={style.preco}
                  type="number"
                  step="0.01"
                  id="preco"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  required
                />
              </div>



            </div>

            <div className={style.botoes}>
              <div className={style.botoesFirst}>
                <button className={style.botaoSalvar} type="submit" disabled={!isValid || uploading}>
                  {uploading ? "Salvando..." : "Salvar"}
                  <LuSave color="white" size={25} />
                </button>
              </div>

              <button className={style.botaoDelet} type="button" onClick={deletarProduto}>
                Deletar
                <FaRegTrashCan color="white" size={20} />
              </button>
            </div>

            {erro && <p style={{ color: "red" }}>{erro}</p>}
          </form>
        </div>
      </div>
    </>
  );
}
