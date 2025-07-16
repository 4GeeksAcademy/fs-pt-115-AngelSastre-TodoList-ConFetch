import { useState } from "react";
import { useEffect } from "react";

export const ToDo = () => {
	const [tarea, setTarea] = useState("");
	const [lista, setLista] = useState([]);
	const [modoEdicion, setModoEdicion] = useState(false);
	const [indiceEditando, setIndiceEditando] = useState(null);


	const crearUsuario = async () => {
		const response = await fetch("https://playground.4geeks.com/todo/users/angel", {
			method: "POST"
		})


	}

	const traerTareasUsuario = async () => {
		const response = await fetch("https://playground.4geeks.com/todo/users/angel")
		if (!response.ok) {
			crearUsuario()
			return
		}
		const data = await response.json()
		console.log(data);
		setLista(data.todos)


	}

	useEffect(() => {
		traerTareasUsuario();
	}, []);

	const crearTareaEnApi = async (nombreDeTarea) => {
		const response = await fetch("https://playground.4geeks.com/todo/todos/angel", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				label: nombreDeTarea,
				is_done: false
			})
		});

		if (!response.ok) {
			console.error("Error al crear tarea:", response.status);
		}
	};






	const agregarTarea = async (evento) => {
		evento.preventDefault();

		if (!tarea.trim()) return;

		if (modoEdicion) {
			// modo edición aún no implementado con PUT
			return;
		}

		await crearTareaEnApi(tarea);
		setTarea("");
		traerTareasUsuario();
	};

	const eliminarTarea = (index) => {
		const nuevaLista = [
			...lista.slice(0, index),
			...lista.slice(index + 1),
		];
		setLista(nuevaLista);
	};

	const tareaTerminada = (index) => {
		const tareaSeleccionada = { ...lista[index], completada: true };
		const listaSinTarea = lista.filter((_, i) => i !== index);
		setLista([...listaSinTarea, tareaSeleccionada]);
	};

	const modificarTarea = (index) => {
		setModoEdicion(true);
		setIndiceEditando(index);
		setTarea(lista[index].label);
	};

	return (
		<>
			<h1 className="text-center mt-5 mb-5 text-primary">Lista de Tareas</h1>
			<main className="container">
				<form onSubmit={agregarTarea}>
					<input
						className="form-control"
						type="text"
						placeholder={modoEdicion ? "Edita tu tarea" : "¿Qué necesitas hacer?"}
						value={tarea}
						onChange={(e) => setTarea(e.target.value)}
					/>
					{modoEdicion && (
						<button className="btn btn-warning mt-2" type="submit">
							Guardar edición
						</button>
					)}
				</form>
				<ul className="list-group mt-3">
					{lista.length === 0 ? (
						<li className="list-group-item text-muted">No hay tareas pendientes</li>
					) : (
						lista.map((item, index) => (
							<li
								key={index}
								className={`list-group-item d-flex justify-content-between align-items-center ${item.completada ? "bg-success text-white tarea-completada" : ""}`}
							>
								{item.label}
								<div>
									<button
										className="btn btn-sm btn-primary me-2"
										onClick={() => modificarTarea(index)}
										style={{
											display: item.completada ? "none" : "inline-block",
										}}
									>
										✏️
									</button>
									<button
										className="btn btn-sm btn-danger me-2"
										onClick={() => eliminarTarea(index)}
									>
										❌
									</button>
									<button
										className="btn btn-sm btn-success"
										onClick={() => tareaTerminada(index)}
										style={{
											display: item.completada ? "none" : "inline-block",
										}}
									>
										✔️
									</button>
								</div>
							</li>
						))
					)}
				</ul>
			</main>
		</>
	);
};
