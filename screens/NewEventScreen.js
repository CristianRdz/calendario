import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Modal from "react-native-modal";
import { Calendar, LocaleConfig } from "react-native-calendars";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import 'react-native-get-random-values';
import { editarEvento, guardarEvento } from "../EventsService";




LocaleConfig.locales["es"] = {
  monthNames: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  monthNamesShort: [
    "Ene.",
    "Feb.",
    "Mar.",
    "Abr.",
    "May.",
    "Jun.",
    "Jul.",
    "Ago.",
    "Sep.",
    "Oct.",
    "Nov.",
    "Dic.",
  ],
  dayNames: [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ],
  dayNamesShort: ["Dom.", "Lun.", "Mar.", "Mié.", "Jue.", "Vie.", "Sáb."],
};

LocaleConfig.defaultLocale = "es";

const NewEventScreen = (props) => {
  const [eventEdit, setEventEdit] = useState(props.route.params ? props.route.params.event : null);
  const [isPriorityVisible, setPriorityVisible] = useState(false);
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Baja");
  const [selectedDate, setSelectedDate] = useState(""); // Agregamos estado para la fecha
  const navigation = useNavigation(); // Obtenemos el objeto de navegación
 

  const priorityOptions = ["Baja", "Media", "Alta"];

  const togglePriorityModal = () => {
    setPriorityVisible(!isPriorityVisible);
      };

    const toggleCalendarModal = () => {
      setCalendarVisible(!isCalendarVisible);
    };

    const handleOptionSelect = (option) => {
      setSelectedOption(option);
      togglePriorityModal();
    };

    const handleDateSelect = (date) => {
      setSelectedDate(date);
      toggleCalendarModal();
    };
    const saveEvent = async (event) => {
      try {
        await guardarEvento(event);
        navigation.goBack();
      } catch (error) {
        console.error("Error al guardar el evento:", error);
      }
    };

    const editEvento = async (id, event) => {
      try {
        await editarEvento(id, event);
        navigation.goBack();
      } catch (error) {
        console.error("Error al editar el evento:", error);
      }
    };
    
    
    const [eventName, setEventName] = useState(""); // Agregamos estado para el nombre del evento

    const handleNameChange = (text) => {
      setEventName(text);
    };

    const handleSaveEvent = () => {
      const eventPriority = selectedOption;
      const eventDate = selectedDate;

      let event = {
        name: eventName,
        priority: eventPriority,
        date: eventDate,
      };
      if (eventEdit) {
        event.id = eventEdit.id;
        editEvento(eventEdit.id, event);
      } else {
        saveEvent(event);
      }
    };
    
    useEffect(() => {
      if (eventEdit) {
        setSelectedOption(eventEdit.priority);
        setSelectedDate(eventEdit.date);
        setEventName(eventEdit.name);
      }
    }
    , [eventEdit]);
    
    return (
      <View style={styles.container}>
        <View style={styles.viewTitle}>
          <Text style={styles.title}>{eventEdit ? "Editar Evento" : "Nuevo Evento"}</Text>
        </View>
        <View style={styles.formEvent}>
          <Text style={styles.formText}>Nombre: </Text>
          <TextInput
            style={styles.input}
            placeholder="Ejemplo: Cita con el dentista..."
            placeholderTextColor="gray"
            value={eventName} 
            onChangeText={handleNameChange}
                      />
          <Text style={styles.formText}>Prioridad: </Text>
          <TouchableOpacity
            onPress={togglePriorityModal}
            style={styles.selectButton}
          >
            <Text style={styles.selectedOptionText}>{selectedOption}</Text>
          </TouchableOpacity>
          <Text style={styles.formText}>Fecha:</Text>
          <TouchableOpacity
            onPress={toggleCalendarModal}
            style={styles.selectButton}
          >
            <Text style={styles.selectedOptionText}>
              {selectedDate || "Seleccionar Fecha"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.options}>
          <TouchableOpacity style={styles.buttonSave} onPress={handleSaveEvent}>
            <Icon name="check" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonCancel}
            onPress={() => navigation.goBack()}
          >
            <Icon name="close" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <Modal isVisible={isPriorityVisible}>
          <View style={styles.modalContent}>
            {priorityOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.modalOption}
                onPress={() => handleOptionSelect(option)}
              >
                <Text>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Modal>
        <Modal isVisible={isCalendarVisible}>
          <View style={styles.modalContent}>
            <Calendar onDayPress={(day) => handleDateSelect(day.dateString)} />
          </View>
        </Modal>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#000",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    title: {
      color: "white",
      fontSize: 30,
      fontWeight: "bold",
      marginBottom: 10,
    },
    viewTitle: {
      width: "100%",
      height: "10%",
      backgroundColor: "#000",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 50,
    },
    formEvent: {
      padding: 20,
      width: "90%",
      height: "40%",
      backgroundColor: "#252525",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      borderRadius: 10,
      marginTop: 20,
    },
    formText: {
      color: "white",
      fontSize: 15,
      fontWeight: "bold",
      marginTop: 10,
      marginBottom: 10,
    },
    input: {
      backgroundColor: "white",
      color: "black",
      fontSize: 14,
      padding: 10,
      borderRadius: 5,
      width: "100%",
      marginBottom: 10,
    },
    selectButton: {
      backgroundColor: "white",
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    },
    selectedOptionText: {
      fontSize: 14,
      color: "black",
    },
    modalContent: {
      backgroundColor: "white",
      padding: 20,
      borderRadius: 10,
    },
    modalOption: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
    },
    options: {
      width: "90%",
      height: "10%",
      backgroundColor: "#252525",
      paddingLeft: 40,
      paddingRight: 40,
      alignItems: "center",
      justifyContent: "space-between", // Alinea elementos horizontalmente
      borderRadius: 10,
      marginTop: 20,
      flexDirection: "row", // Para que los botones estén en fila
    },
    buttonSave: {
      backgroundColor: "#1BB94F",
      borderRadius: 5,
      padding: 10,
      width: 80, // Ancho del botón
      alignItems: "center",
      justifyContent: "center",
    },
    buttonCancel: {
      backgroundColor: "red",
      borderRadius: 5,
      padding: 10,
      width: 80, // Ancho del botón
      alignItems: "center",
      justifyContent: "center",
    },
  });

  export default NewEventScreen;