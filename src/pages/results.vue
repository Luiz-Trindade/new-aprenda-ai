<template>
    <v-container class="fade-in fill-height d-flex align-center justify-center">
        <v-row>
            <v-col cols="12" class="d-flex flex-column align-center">
                <v-list-subheader class="mb-4 text-center">
                    <v-icon class="mr-2" color="primary">mdi-chart-bar</v-icon>
                    Resultados
                </v-list-subheader>

                <!-- Lista de Todos os Tópicos -->
                <v-card v-for="topic in allTopics" :key="topic.id" class="mb-4" width="100%">
                    <v-card-item>
                        <v-card-title class="text-body-1">
                            <v-icon class="mr-2">{{ getTopicIcon(topic.category) }}</v-icon>
                            {{ topic.title }}

                            <v-chip small :color="getDifficultyColor(topic.difficulty)" class="ml-2">
                                {{ topic.difficulty }}
                            </v-chip>
                        </v-card-title>
                    </v-card-item>

                    <v-card-actions>
                        <v-btn class="elevation-2" variant="flat" rounded="xl" color="success" @click="viewDetails(topic.id)" size="small">
                            <v-icon start class="mr-1">mdi-chart-bar</v-icon>
                            Resultados
                        </v-btn>
                        <v-spacer></v-spacer>
                        <span class="text-caption">
                            {{ topic.questions || 0 }} questões
                        </span>
                    </v-card-actions>
                </v-card>

                <!-- Mensagem quando não há tópicos -->
                <v-card v-if="allTopics.length === 0" class="pa-6 text-center">
                    <v-icon size="large" class="mb-2">mdi-chart-line</v-icon>
                    <p class="text-body-1">Nenhum tópico encontrado</p>
                    <v-btn color="primary" class="mt-4" @click="navigateTo('/topics')">
                        <v-icon start>mdi-plus</v-icon>
                        Criar Primeiro Tópico
                    </v-btn>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const topics = ref([])

// Carrega tópicos do localStorage
function loadTopics() {
    const savedTopics = localStorage.getItem('topics')
    if (savedTopics) {
        topics.value = JSON.parse(savedTopics)
        console.log('Tópicos carregados:', topics.value) // Para debug
    }
}

// Mostra todos os tópicos
const allTopics = computed(() => {
    return topics.value.map(topic => ({
        ...topic,
        progress: topic.progress || 0 // Garante que progresso seja número
    }))
})

// Métodos auxiliares
function getTopicIcon(category) {
    return {
        ai: 'mdi-robot',
        programming: 'mdi-code-braces',
        math: 'mdi-calculator'
    }[category] || 'mdi-book'
}

function getDifficultyColor(difficulty) {
    return {
        'Fácil': 'green-lighten-2',
        'Médio': 'orange-lighten-2',
        'Difícil': 'red-lighten-2',
        'Variado': 'blue-lighten-2'
    }[difficulty] || 'grey'
}

// Navegação
function viewDetails(topicId) {
    router.push(`/results/${topicId}`)
}

function navigateTo(route) {
    router.push(route)
}

// Carrega os tópicos quando o componente é montado
onMounted(() => {
    loadTopics()
})
</script>

<style scoped></style>