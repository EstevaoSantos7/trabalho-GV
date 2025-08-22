import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import style from "../styles/cadastroCateg.module.css";
import imagemFundo from '../images/ciclista.jpeg'
import { LuSave } from "react-icons/lu";

const api = axios.create({
  baseURL: "http://localhost:3333",
});

export default function CadastroCategoria() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagemFile, setImagemFile] = useState(null);
  const [erro, setErro] = useState("");
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  const isValid = nome.trim() !== "" && descricao.trim() !== "";

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", nome);
    formData.append("description", descricao);
    if (imagemFile) {
      formData.append("image", imagemFile); // campo "image"
    }

    try {
      setUploading(true);
      await api.post("/categorias", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/categorias");
    } catch (err) {
      console.error("Erro ao salvar categoria:", err);
      setErro("Erro ao salvar categoria.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <Header />
      <div className={style.containerTudo}>
        <div className={style.containerCadastro}>

          <form onSubmit={handleSubmit}>
            <h2>Cadastro de Categoria</h2>

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

            {/* <div className={style.imageDiv}>
              <label className={style.label} htmlFor="imagem">Imagem da Categoria</label>
              <input
                className={style.imagem}
                type="file"
                id="imagem"
                accept="image/*"
                onChange={(e) => setImagemFile(e.target.files[0])}
              />
            </div> */}

            <div className={style.botoes}>

              <button
                type="submit"
                disabled={!isValid || uploading}
                className={style.botaoSalvar}
              >
                {uploading ? "Salvando..." : "Salvar"}
                <LuSave color="white" />
              </button>
            </div>

            {erro && <p style={{ color: "red" }}>{erro}</p>}
          </form>
        </div>
      </div>
    </>
  );
}
