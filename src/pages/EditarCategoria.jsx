import style from '../styles/editarCategoria.module.css';
import { LuSave } from "react-icons/lu";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { FaRegTrashCan } from 'react-icons/fa6';

const api = axios.create({ baseURL: "http://localhost:3333" });

export default function EditarCategoria() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [erro, setErro] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  async function editarCategoria(e) {
    e.preventDefault();
    setSalvando(true);
    try {
      const formData = new FormData();
      formData.append("name", nome);
      formData.append("description", descricao);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await api.patch(`/categorias/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      navigate("/categorias"); // redireciona após salvar
    } catch (err) {
      setErro(err);
      console.error(err);
    } finally {
      setSalvando(false);
    }
  }

  async function deletarCategoria() {
    if (!window.confirm("Tem certeza que deseja excluir esta categoria?")) return;

    try {
      await api.delete(`/categorias/${id}`);
      navigate("/categorias"); // redireciona após deletar
    } catch (err) {
      setErro(err.message);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/categorias/${id}`);
        setNome(res.data.name);
        setDescricao(res.data.description || "");
      } catch (err) {
        setErro(err);
      }
    })();
  }, [id]);

  const isValid = nome.trim() !== "" && descricao.trim() !== "";

  if (erro?.response?.status === 404) {
    return <h1>Categoria não encontrada</h1>;
  }

  return (
    <>
      <Header />
      <div className={style.containerTudo}>
        <div className={style.containerEditar}>

          <form onSubmit={editarCategoria}>
            <h2>Editar categoria</h2>

            <div className={style.nomeDiv}>
              <label className={style.label} htmlFor="nome">Nome</label>
              <input
                type="text"
                className={style.nome}
                id="nome"
                placeholder="Digite um nome de categoria"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            {/* <div className={style.descDiv}>
              <label className={style.label} htmlFor="descricao">Descrição</label>
              <textarea
                name="descricao"
                id="descricao"
                value={descricao}
                placeholder="Digite uma descrição"
                onChange={(e) => setDescricao(e.target.value)}
                className={style.area}
              />

             
            </div> */}
             <label htmlFor="imageUrl"></label>
              <input className={style.image}
                type="file"
                id="imageUrl"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />

            <div className={style.botoes}>
              <button
                type="submit"
                disabled={!isValid || salvando}
                className={style.botaoSalvar}
              >
                {salvando ? "Salvando..." : "Salvar"}
                <LuSave color="white" />
              </button>
              <button
                className={style.botaoDelet}
                type="button"
                onClick={deletarCategoria}
              >
                Deletar
                <FaRegTrashCan color="white" size={20} />
              </button>
            </div>

            {erro && <p style={{ color: "red" }}>{erro.message || "Erro ao processar"}</p>}
          </form>
        </div>
      </div>
    </>
  );
}
