import {
    useState,
    useEffect
} from "react";

export default function useList(sequence = [], $range = 5)
{
    const [list, setList] = useState(sequence);
    const [pointer, setPointer] = useState(0);
    const [range, setRange] = useState({start: 0, end: $range});
    const [item, setItem] = useState(null);
    const [chunk, setChunk] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        if(list.length)
	{
            handleSetItem(); // inicializa un item
	    handleSetChunk(); // inicializa un trozo
	}
    }, [list, range]);

    useEffect(() => {
        if(selected)
	    setPointer(selected.pos); // reestablece el puntero a la posicion del item seleccionado
    }, [selected]);

    useEffect(() => {
        // cada vez que cambia el puntero hay que actualizar el item
	handleSetItem();
	// si el puntero apunta a un limite que supera el trozo, se 
	// desplaza el trozo a la posicion del puntero
	if(chunk.length && pointer === chunk[chunk.length - 1].pos + 1)
	{
	    // el limite que supera el puntero puede ser hacia la derecha
            nextChunk();
	}else if(chunk.length && pointer === chunk[0].pos - 1)
	{

	    // o hacia la izquierda
	    prevChunk();
	}else{
            // cada vez que se reestablece el trozo se reestablecen 
	    // los estados de cada item dentro del trozo
	    handleSetChunk();
	}
    }, [pointer]);

    const handleSetItem = () => {
        setItem(list[pointer]);
    }

    const handleSetChunk = () => {
	// el trozo es una parte de toda lista recibida que se va 
	// desplazando segun se reestablece el puntero, cada item
	// en el trozo posee un estado que determina si esta 
	// seleccionado o no
        setChunk(list.slice(range.start, range.end).map(item => {
            if(item === list[pointer])
		// si esta seleccionado
		return {
                    isTarget: true,
		    value: item,
		    pos: list.indexOf(item)
		};
	    // si no estan seleccionados
            return {
                isTarget: false,
		value: item,
		pos: list.indexOf(item)
	    };
	}));
    }

    // reestablece el puntero a la siguiente posicion
    const next = () => {
        if(pointer < list.length - 1)
	    setPointer(pointer + 1);
    }

    // reestablece el puntero a la posicion anterior
    const prev = () => {
        if(pointer > 0 )
	    setPointer(pointer - 1);
    }

    // reestablece el trozo al puntero hacia la derecha, lo desplaza
    const nextChunk = () => {
        if(range.end < list.length)
	    setRange({
                start: range.start + 1,
		end: range.end + 1
	    });
    }

    // reestablece el trozo al puntero hacia la izquierda, lo desplaza
    const prevChunk = () => {
        if(range.start > 0)
	    setRange({
                start: range.start - 1,
		end: range.end - 1
	    });
    }

    // reestablece el puntero al principio y desplaza el trozo al 
    // limite inferior
    const head = () => {
        setPointer(0);
	setRange({start: 0, end: $range});
    }

    // reestablece el puntero al final y desplaza el trozo al limite
    // superior
    const tail = () => {
        setPointer(list.length - 1);
	setRange({
            start: list.length - range.end,
	    end: list.length
	});
    }

    return {
        item,
	chunk,
	list,
	init: sequence => setList(sequence), // inicializa la lista
	next,
	prev,
	pointer,
	selected: selected => setSelected(selected), // obtiene el item seleccionado
	head,
	tail,
	nextChunk,
	prevChunk
    };
}
