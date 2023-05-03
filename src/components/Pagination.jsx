import { useState, useEffect } from "react";
import useList from "/src/hooks/useList";
import {
  ChevronLeft,
  ChevronDoubleLeft,
  ChevronRight,
  ChevronDoubleRight,
} from "react-bootstrap-icons";

function Pagination({ sendItem, collection, range }) {
  /* Pagination: Componente que renderiza una lista de botones
   * que establecen un enlace entre la referencia del boton y
   * un elemento perteneciente a una coleccion que se quiera
   * separar por paginas.
   *
   *     sendItem: [Callback] es la referencia a una funcion que
   *     permite enviar el elemento seleccionado, cada vez que se
   *     haga click.
   *
   *     collection: [Array] es la coleccion de datos que se quiere
   *     seccionar en paginas.
   *
   *     range: [Number] establece el tamaño del trozo de
   *     elementos seleccionables, el cual varia con los
   *     desplazamientos hacia el siguiente o hacia el anterior.
   * */
  const { init, item, chunk, selected, head, prev, next, tail, pointer } =
    useList(collection, range || 5);

  // cada vez que la coleccion se actuliza o se prepara para cargar
  // se inicializa la lista
  useEffect(() => {
    if (collection.length) init(collection);
  }, [collection]);

  // cada vez que se selecciona un item, se envia hacia el padre
  useEffect(() => {
    sendItem(item);
  }, [item]);

  // se envia el item seleccionado con todas las propiedades
  const handleClick = (event) => {
    selected(JSON.parse(event.target.value));
  };

  return (
    <ul>
      <li>
        <button onClick={() => head()} disabled={!Boolean(pointer)}>
          <ChevronDoubleLeft />
        </button>
      </li>
      <li>
        <button onClick={() => prev()} disabled={!Boolean(pointer)}>
          <ChevronLeft />
        </button>
      </li>
      {Boolean(chunk.length) &&
        chunk.map((page, index) => {
          return (
            <li key={index}>
              <button
                onClick={handleClick}
                value={JSON.stringify(page)}
                style={
                  page.isTarget
                    ? { backgroundColor: "red" }
                    : { backgroundColor: "gray" }
                }
              >
                {page.pos + 1}
              </button>
            </li>
          );
        })}
      <li>
        <button
          onClick={() => next()}
          disabled={pointer === collection.length - 1}
        >
          <ChevronRight />
        </button>
      </li>
      <li>
        <button
          onClick={() => tail()}
          disabled={pointer === collection.length - 1}
        >
          <ChevronDoubleRight />
        </button>
      </li>
    </ul>
  );
}

export default Pagination;
