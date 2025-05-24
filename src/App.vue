<template>
    <v-app :theme="theme.global.name.value">
        <router-view />
    </v-app>
</template>

<script setup>
import { useTheme } from 'vuetify'

const theme = useTheme()

// Inicializa o tema com o valor salvo no localStorage ou 'light' como padrão
theme.global.name.value = localStorage.getItem('appTheme') || 'light'
</script>