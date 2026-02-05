import { useEffect, useState } from "react";
import {
    Button,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import {
    adicionarProduto,
    buscarProdutos,
    initDB,
} from "./src/services/Database";
