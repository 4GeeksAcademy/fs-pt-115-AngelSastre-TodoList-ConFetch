import { useState, useEffect } from "react";


export const ToDo = () => {
	const [tarea, setTarea] = useState("");
	const [lista, setLista] = useState([]);
	const [modoEdicion, setModoEdicion] = useState(false);
	const [indiceEditando, setIndiceEditando] = useState(null);


	useEffect(() => {
		traerTareasUsuario();
	}, []);


	const crearUsuario = async () => {
		const response = await fetch("https://playground.4geeks.com/todo/users/angel", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify([])
		});

		if (response.ok) {
			console.log("Usuario creado correctamente");
			traerTareasUsuario();
		} else {
			const error = await response.json();
			console.error("Error al crear usuario:", error);
		}
	};


	const traerTareasUsuario = async () => {
		const response = await fetch("https://playground.4geeks.com/todo/users/angel");
		if (!response.ok) {
			crearUsuario();
			return;
		}
		const data = await response.json();

		const tareasPendientes = data.todos.filter((tarea) => !tarea.is_done);
		const tareasCompletadas = data.todos.filter((tarea) => tarea.is_done);

		setLista([...tareasPendientes, ...tareasCompletadas]);
	};


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

		if(tarea.trim() === "") return;

		if (modoEdicion) {
			const tareaAEditar = lista[indiceEditando];

			await fetch(`https://playground.4geeks.com/todo/todos/${tareaAEditar.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					label: tarea,
					is_done: tareaAEditar.is_done
				})
			});

			setModoEdicion(false);
			setIndiceEditando(null);
			setTarea("");
			traerTareasUsuario();
			return;
		}

		await crearTareaEnApi(tarea);
		setTarea("");
		traerTareasUsuario();
	};


	const modificarTarea = (index) => {
		setModoEdicion(true);
		setIndiceEditando(index);
		setTarea(lista[index].label);
	};




	const eliminarTarea = async (index) => {
		const tarea = lista[index];
		const response = await fetch(`https://playground.4geeks.com/todo/todos/${tarea.id}`, {
			method: "DELETE"
		});

		if (!response.ok) {
			console.error("Error al eliminar tarea:", response.status);
			return;
		}

		traerTareasUsuario();
	};




	const tareaTerminada = async (index) => {
		const tarea = lista[index];

		const response = await fetch(`https://playground.4geeks.com/todo/todos/${tarea.id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				label: tarea.label,
				is_done: true
			})
		});

		if (!response.ok) {
			console.error("Error al marcar como hecha:", response.status);
			return;
		}

		traerTareasUsuario();
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
								className={`list-group-item d-flex justify-content-between align-items-center ${item.is_done ? "bg-success text-white tarea-completada" : ""}`}
							>
								{item.label}
								<div>
									<button
										className="btn-li btn btn-sm btn-primary me-2"
										onClick={() => modificarTarea(index)}
										style={{
											display: item.is_done ? "none" : "inline-block",
										}}
									>
										✏️
									</button>
									<button
										className="btn-li btn btn-sm btn-danger me-2"
										onClick={() => eliminarTarea(index)}
									>
										❌
									</button>
									<button
										className="btn-li btn btn-sm btn-success"
										onClick={() => tareaTerminada(index)}
										style={{
											display: item.is_done ? "none" : "inline-block",
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
