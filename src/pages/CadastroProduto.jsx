import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import style from "../styles/cadatrarPro.module.css";

import { LuSave } from "react-icons/lu";
import { FaRegTrashCan } from "react-icons/fa6";

const api = axios.create({
  baseURL: "http://localhost:3333"
});

export default function CadastroProduto() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [quantidade, setQuantidade] = useState(0);
  const [imagemFile, setImagemFile] = useState(null);
  const [categoriaId, setCategoriaId] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [erro, setErro] = useState("");
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    api.get("/categorias")
      .then(res => setCategorias(res.data))
      .catch(err => console.error("Erro ao buscar categorias:", err));
  }, []);

  const isValid =
    nome.trim() !== "" &&
    descricao.trim() !== "" &&
    preco !== "" &&
    imagemFile !== null &&
    !isNaN(parseFloat(preco));

  async function handleSubmit(e) {
    e.preventDefault();

    if (!imagemFile) {
      setErro("Selecione uma imagem antes de salvar.");
      return;
    }

    const formData = new FormData();
    formData.append("image", imagemFile); // precisa ser "image" por causa do upload.single("image")
    formData.append("name", nome);
    formData.append("description", descricao);
    formData.append("price", preco);
    formData.append("quantity", quantidade);
    formData.append("categoryId", categoriaId || "");

    try {
      setUploading(true);
      await api.post("/produtos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/produtos");
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      setErro("Erro ao salvar produto.");
    } finally {
      setUploading(false);
    }
  }



  return (
    <>
      <Header />
      <div className={style.containerTudo}>
        <div className={style.containerEditar}>

          <form onSubmit={handleSubmit}>
            <h2>Cadastro de Produto</h2>
            <div className={style.gridCadastro}>


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



              <div className={style.qunatidadeDiv}>
                <label className={style.label} htmlFor="quantidade">Quantidade</label>
                <input
                  className={style.qunat}
                  type="number"
                  id="quantidade"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                />
              </div>
              <div className={style.categoriaDiv}>
                <label className={style.label} htmlFor="categoria">Categoria</label>
                <select
                  className={style.categ}
                  id="categoria"
                  value={categoriaId}
                  onChange={(e) => setCategoriaId(e.target.value)}
                >
                  <option value="">Sem categoria</option>
                  {categorias.map(categoria => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.name}
                    </option>
                  ))}
                </select>
              </div>


            </div>



            <div className={style.botoes}>
              <div className={style.botoesFirst}>
                {/* <button className={style.botaoCancelar} type="button" onClick={() => navigate(-1)}>
                  Cancelar
                </button> */}
                <button className={style.botaoSalvar} type="submit" disabled={!isValid || uploading}>
                  {uploading ? "Salvando..." : "Salvar"}
                  <LuSave color="white" size={25} />
                </button>
              </div>

            </div>

            {erro && <p style={{ color: "red" }}>{erro}</p>}
          </form>
        </div>
      </div>
    </>
  );
}
