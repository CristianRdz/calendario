import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { eliminarEvento } from "../EventsService";

const EventsScreen = () => {
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const getEvents = async () => {
    try {
      const eventosGuardados = await AsyncStorage.getItem("eventos");
      const eventosParseados = JSON.parse(eventosGuardados || "[]");
      setEvents(eventosParseados);
    } catch (error) {
      console.error("Error al obtener los eventos:", error);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      getEvents();
    }, [])
  );

  const handleNavigateToNewEvent = () => {
    navigation.navigate("NewEventStackScreen", {
      screen: "NewEventScreen",
    });
  };

  const handleNavigateToEditEvent = (event) => {
    navigation.navigate("NewEventStackScreen", {
      screen: "NewEventScreen",
      params: { event },
    });
  };

  const handleDeleteEvent = async (id) => {
    await eliminarEvento(id);
    await getEvents();
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getEvents();
    setRefreshing(false);
  }, []);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.viewTitle}>
        <Text style={styles.title}>Eventos</Text>
      </View>
      <View style={styles.events}>
        <View style={styles.more}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleNavigateToNewEvent}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        style={styles.eventsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {events.length > 0 ? (
          <>
            {events.map((event) => (
              <View key={event.id} style={styles.event}>
                <View style={styles.infoevent}>
                  <Text style={styles.eventText}>Nombre: {event.name}</Text>
                  <Text style={styles.eventText}>
                    Prioridad: {event.priority}
                  </Text>
                  <Text style={styles.eventText}>Fecha: {event.date}</Text>
                </View>
                <View style={styles.options}>
                  <TouchableOpacity
                    style={styles.buttonEdit}
                    onPress={() => handleNavigateToEditEvent(event)}
                  >
                    <Icon name="edit" size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttonDelete}
                    onPress={() => handleDeleteEvent(event.id)}
                  >
                    <Icon name="trash" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            style={styles.eventsList}
          >
            <Text style={styles.noElementosText}>
            Sin eventos...{"\n"}¡Agrega uno!
            </Text>
          </ScrollView>
        )}
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  noElementosText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    color: "white",
  },

  container: {
    flexGrow: 1,
    backgroundColor: "#000",
    alignItems: "center",
    paddingBottom: 60,
    height: "100%",
  },
  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 5,
  },
  viewTitle: {
    width: "100%",
    height: 50,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  events: {
    width: "99%",
    backgroundColor: "#252525",
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
    height: "auto",
    paddingTop: 20,
    paddingBottom: 40,
    overflow: "scroll",
  },
  eventsList: {
    width: "100%",
    height: "auto",
    paddingLeft: 30,
    paddingRight: 30,
  },
  button: {
    backgroundColor: "#1BB94F",
    padding: 10,
    borderRadius: 10,
    width: 50,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  more: {
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  event: {
    width: "100%",
    height: "auto",
    backgroundColor: "#79D8EB",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 20,
    padding: 10,
  },
  eventText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  infoevent: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  options: {
    marginTop: 20,
    paddingTop: 10,
    paddingBottom: 10,
    width: "80%",
    height: "auto",
    backgroundColor: "#252525",
    paddingLeft: 40,
    paddingRight: 40,
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
    flexDirection: "row",
  },
  buttonDelete: {
    backgroundColor: "#FF3B30",
    padding: 10,
    borderRadius: 10,
    alignContent: "center",
    justifyContent: "center",
    width: "auto",
  },
  buttonEdit: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 10,
    width: "auto",
    alignContent: "center",
    justifyContent: "center",
  },
});

export default EventsScreen;
