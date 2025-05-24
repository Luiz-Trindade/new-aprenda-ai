<template>
    <v-container class="fade-in fill-height d-flex align-center justify-center">
        <v-row>
            <v-col cols="12" class="d-flex flex-column align-center">
                <v-list-subheader class="mb-4 text-center">
                    <v-icon class="mr-2" color="primary">mdi-format-list-bulleted</v-icon>
                    Tópicos
                </v-list-subheader>

                <!-- Botão para adicionar novo tópico -->
                <v-btn 
                    color="primary" 
                    class="mb-6 action-btn" 
                    :elevation="4" 
                    rounded="xl"
                    @click="navigateTo('/create-topic')"
                >
                    <v-icon start>mdi-plus</v-icon>
                    Novo Tópico
                </v-btn>

                <!-- Lista simplificada de tópicos -->
                <v-card  v-for="topic in topics" :key="topic.id" class="mb-3 topic-card elevation-4" width="100%">
                    <v-card-item>
                        <v-card-title class="text-body-1">
                            <v-icon class="mr-2">{{ getTopicIcon(topic.category) }}</v-icon>
                            {{ topic.title }}
                        </v-card-title>
                    </v-card-item>

                    <v-card-actions>
                        <v-btn 
                            variant="flat" 
                            rounded="xl"
                            color="warning" 
                            @click="startQuiz(topic.id)"
                            size="small"
                        >
                            <v-icon start class="mr-1">mdi-lightbulb</v-icon>
                            Testar
                        </v-btn>

                        <v-spacer></v-spacer>
                        <span class="text-caption">{{ topic.progress }}% acertividade</span>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Dados de exemplo (simplificados)
const topics = ref([
    {
        id: '1',
        title: 'Introdução à IA',
        category: 'ai',
        questions: 12,
        progress: 75
    },
    {
        id: '2',
        title: 'Python Básico',
        category: 'programming',
        questions: 15,
        progress: 30
    },
    {
        id: '3',
        title: 'Matemática para IA',
        category: 'math',
        questions: 20,
        progress: 60
    },
    {
        id: '4',
        title: 'Redes Neurais',
        category: 'ai',
        questions: 18,
        progress: 40
    },
    {
        id: '5',
        title: 'Estruturas de Dados',
        category: 'programming',
        questions: 22,
        progress: 55
    }
])

// Métodos auxiliares (simplificados)
function getTopicIcon(category) {
    return {
        ai: 'mdi-robot',
        programming: 'mdi-code-braces',
        math: 'mdi-calculator'
    }[category] || 'mdi-book'
}

// Navegação
function startQuiz(topicId) {
    router.push(`/quiz/${topicId}`)
}

function navigateTo(route) {
    router.push(route)
}
</script>

<style scoped>
</style>