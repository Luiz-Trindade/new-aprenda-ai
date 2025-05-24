<template>
    <v-container class="fade-in">
        <v-row>
            <v-col cols="12" class="d-flex flex-column align-center">
                <v-list-subheader class="mb-4 text-center">
                    <v-icon class="mr-2" color="primary">mdi-chart-bar</v-icon>
                    Resultados
                </v-list-subheader>

                <!-- Lista de Todos os Tópicos -->
                <v-card v-for="topic in allTopics" :key="topic.id" class="mb-4" width="100%"
                    @click="viewDetails(topic.id)">
                    <v-card-item>
                        <v-card-title>
                            <v-icon class="mr-2">{{ getTopicIcon(topic.category) }}</v-icon>
                            {{ topic.title }}
                        </v-card-title>

                        <v-card-subtitle class="d-flex align-center mt-2">
                            <v-chip small :color="getDifficultyColor(topic.difficulty)" class="mr-2">
                                {{ topic.difficulty }}
                            </v-chip>
                            
                            <span class="text-caption">
                                {{ topic.questions || 0 }} questões
                            </span>
                        </v-card-subtitle>
                    </v-card-item>
                </v-card>

                <!-- Mensagem quando não há tópicos -->
                <v-card v-if="allTopics.length === 0" class="pa-6 text-center">
                    <v-icon size="large" class="mb-2">mdi-chart-line</v-icon>
                    <p class="text-body-1">Nenhum tópico encontrado</p>
                    <v-btn color="primary" class="mt-4" @click="navigateTo('/create-topic')">
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

<style scoped>
.v-card {
    transition: transform 0.2s;
    cursor: pointer;
}

.v-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>