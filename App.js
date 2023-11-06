import React from "react";
import Navigation from "./Navigation";
import { LogBox } from "react-native";
import { StatusBar } from "expo-status-bar";

LogBox.ignoreAllLogs();
export default function App(){
    return(
        <>
        <StatusBar backgroundColor="black" style="light"/>
        <Navigation/>
        </>
    );
}