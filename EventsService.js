import AsyncStorage from "@react-native-async-storage/async-storage";
import {v4 as uuidv4} from 'uuid';
export async function guardarEvento(evento) {
    try {
      // Obtener la lista actual de eventos desde AsyncStorage
      const eventosGuardados = await AsyncStorage.getItem("eventos");
      const eventosParseados = JSON.parse(eventosGuardados || "[]");
  
      // Generar un nuevo ID para el evento
      const id =  uuidv4();
  
      // Agregar el evento al arreglo de eventos
      eventosParseados.push({ id, ...evento });
  
      // Guardar el arreglo actualizado en AsyncStorage
      await AsyncStorage.setItem("eventos", JSON.stringify(eventosParseados));
  
      // Alerta de éxito
      alert("Evento guardado con éxito");
    } catch (error) {
      console.log(error);
      alert("Error al guardar el evento");
    }
  }
  
  // Obtener todos los eventos
  export async function obtenerEventos() {
    try {
      const eventosGuardados = await AsyncStorage.getItem("eventos");
      const eventosParseados = JSON.parse(eventosGuardados || "[]");
      return eventosParseados;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  export async function obtenerEventosPorFecha(fecha) {
    try {
        const eventosGuardados = await AsyncStorage.getItem("eventos");
        const eventosParseados = JSON.parse(eventosGuardados || "[]");
        const eventosFiltrados = eventosParseados.filter((evento) => evento.date === fecha);
        return eventosFiltrados;
    } catch (error) {
        console.log(error);
        return [];
    }
}
  
  // Eliminar un evento por su ID
  export async function eliminarEvento(id) {
    try {
      const eventosGuardados = await AsyncStorage.getItem("eventos");
      const eventosParseados = JSON.parse(eventosGuardados || "[]");
  
      // Filtrar el evento con el ID proporcionado
      const eventosFiltrados = eventosParseados.filter((evento) => evento.id !== id);
  
      // Guardar el arreglo actualizado en AsyncStorage
      await AsyncStorage.setItem("eventos", JSON.stringify(eventosFiltrados));
  
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  
  // Editar un evento por su ID
  export async function editarEvento(id, nuevoEvento) {
    try {
      await eliminarEvento(id);
      await guardarEvento(nuevoEvento);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  