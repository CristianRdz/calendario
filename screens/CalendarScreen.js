import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import Modal from "./Modal";
import EventsForDay from "./EventsForDay";

// Configura el idioma en español
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

const CalendarScreen = () => {
  const [showModal, setShowModal] = useState(false);
  const [renderComponent, setRenderComponent] = useState(null);
  const [date, setDate] = useState(null);
  const openClose = () => setShowModal((prevState) => !prevState);
  return (
    <View style={styles.container}>
      <View style={styles.viewTitle}>
        <Text style={styles.title}>Calendario</Text>
      </View>
      <Calendar
        style={styles.calendar}
        theme={{
          calendarBackground: "black",
          textSectionTitleColor: "#b6c1cd",
          todayTextColor: "green",
          dayTextColor: "white",
          textDisabledColor: "gray",
          monthTextColor: "white",
        }}
        onDayPress={(day) => {
          setDate(day.dateString);
          setRenderComponent(
            <EventsForDay date={day.dateString} close={openClose} />
          );
          openClose();

        }}
      />
      <Modal isVisible={showModal} close={openClose}>
        {renderComponent}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
    justifyContent: "center",
  },
  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },
  calendar: {
    width: "100%",
    height: "70%",
    backgroundColor: "#000",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "green",
  },
  viewTitle: {
    width: "100%",
    height: "10%",
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CalendarScreen;
