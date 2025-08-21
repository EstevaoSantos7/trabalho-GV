import { Link } from "react-router-dom";

export default function Header() {
  return (
   <header>
    <h1>GV BIKES</h1>
   <nav>
    <Link to="/">Home</Link>
    <Link to="/produtos">Produtos</Link>
    <Link to="/categorias">Categorias</Link>
    </nav>
    </header>
  )
}