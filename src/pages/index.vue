<template>
    <v-container class="fill-height d-flex align-center justify-center">
        <v-row>
            <v-col cols="12" class="d-flex flex-column align-center">
                <v-list-subheader class="mb-4 text-center">Tela Inicial</v-list-subheader>

                <v-btn v-for="(item, i) in items" :key="i" color="primary" class="mb-3 action-btn" :elevation="4"
                    rounded="xl" @click="handleClick(item.action)">
                    <v-icon start>{{ item.icon }}</v-icon>
                    {{ item.text }}
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
const items = [
    { text: 'Iniciar Quiz', icon: 'mdi-play-circle', action: 'startQuiz' },
    { text: 'Resultados', icon: 'mdi-chart-bar', action: 'viewResults' },
    { text: 'Configurações', icon: 'mdi-cog-outline', action: 'openSettings' },
    { text: 'Ajuda', icon: 'mdi-help-circle-outline', action: 'openHelp' },
    { text: 'Sair', icon: 'mdi-logout', action: 'logout' },
]

function handleClick(action: string) {
    switch (action) {
        case 'startQuiz':
            console.log('Iniciando quiz...')
            break
        case 'viewResults':
            console.log('Exibindo resultados...')
            break
        case 'openSettings':
            console.log('Abrindo configurações...')
            break
        case 'openHelp':
            console.log('Abrindo ajuda...')
            break
        case 'logout':
            console.log('Saindo do app...')
            break
    }
}
</script>

<style scoped>
.action-btn {
    justify-content: center;
    font-weight: 500;
    transition: transform 0.15s ease-in-out;
    min-width: 220px;
}

.action-btn:hover {
    transform: scale(1.02);
}
</style>
