import React, { createContext, useContext, useReducer, useState } from "react";
import "./App.css";

const TarefaContext = createContext();

const initialState = {
  tarefas: [],
  filtro: "todas",
};

function reducer(state, action) {
  switch (action.type) {
    case "adicionarTarefa":
      return {
        ...state,
        tarefas: [
          ...state.tarefas,
          {
            id: Date.now(),
            nome: action.payload,
            concluida: false,
          },
        ],
      };

    case "alternarTarefa":
      return {
        ...state,
        tarefas: state.tarefas.map((t) =>
          t.id === action.payload ? { ...t, concluida: !t.concluida } : t
        ),
      };

    case "mudarFiltro":
      return {
        ...state,
        filtro: action.payload,
      };

    default:
      return state;
  }
}

function Tarefa({ tarefa }) {
  const { dispatch } = useContext(TarefaContext);

  return (
    <li className="tarefa">
      <input
        type="checkbox"
        checked={tarefa.concluida}
        onChange={() => dispatch({ type: "alternarTarefa", payload: tarefa.id })}
      />
      <span className={tarefa.concluida ? "tarefa-concluida" : ""}>
        {tarefa.nome}
      </span>
    </li>
  );
}

function ListaDeTarefas() {
  const { state } = useContext(TarefaContext);

  const tarefasFiltradas = state.tarefas.filter((t) => {
    if (state.filtro === "concluidas") return t.concluida;
    if (state.filtro === "pendentes") return !t.concluida;
    return true;
  });

  return (
    <ul className="lista">
      {tarefasFiltradas.map((tarefa) => (
        <Tarefa key={tarefa.id} tarefa={tarefa} />
      ))}
    </ul>
  );
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [texto, setTexto] = useState("");

  const adicionar = () => {
    if (texto.trim() === "") return;
    dispatch({ type: "adicionarTarefa", payload: texto });
    setTexto("");
  };

  return (
    <TarefaContext.Provider value={{ state, dispatch }}>
      <div className="container">
        <h1 className="titulo">Gerenciador de Tarefas</h1>

        <div className="input-area">
          <input
            type="text"
            placeholder="Digite uma tarefa..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
          <button className="btn adicionar" onClick={adicionar}>
            Adicionar
          </button>
        </div>

        <div className="filtros">
          <button onClick={() => dispatch({ type: "mudarFiltro", payload: "todas" })}>
            Todas
          </button>
          <button onClick={() => dispatch({ type: "mudarFiltro", payload: "concluidas" })}>
            Concluídas
          </button>
          <button onClick={() => dispatch({ type: "mudarFiltro", payload: "pendentes" })}>
            Pendentes
          </button>
        </div>

        <ListaDeTarefas />
      </div>
    </TarefaContext.Provider>
  );
}
