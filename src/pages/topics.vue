<template>
    <v-container class="fade-in fill-height d-flex align-center justify-center">
        <v-row>
            <v-col cols="12" class="d-flex flex-column align-center">
                <v-list-subheader class="mb-4 text-center">
                    <v-icon class="mr-2" color="primary">mdi-format-list-bulleted</v-icon>
                    Tópicos
                </v-list-subheader>

                <!-- Botão para adicionar novo tópico -->
                <v-btn color="primary" class="mb-6 action-btn" :elevation="4" rounded="xl"
                    @click="navigateTo('/create-topic')">
                    <v-icon start>mdi-plus</v-icon>
                    Novo Tópico
                </v-btn>

                <!-- Lista simplificada de tópicos -->
                <v-card v-for="topic in topics" :key="topic.id" class="mb-3 topic-card elevation-4" width="100%">
                    <!-- Botão de fechar (novo) -->
                    <v-btn icon variant="text" size="x-small" class="close-btn" @click.stop="confirmDelete(topic)">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>

                    <v-card-item>
                        <v-card-title class="text-body-1">
                            <v-icon class="mr-2">{{ getTopicIcon(topic.category) }}</v-icon>
                            {{ topic.title }}
                        </v-card-title>
                    </v-card-item>

                    <v-card-actions>
                        <v-btn variant="flat" rounded="xl" color="warning" @click="startQuiz(topic.id)" size="small">
                            <v-icon start class="mr-1">mdi-lightbulb</v-icon>
                            Testar
                        </v-btn>

                        <v-spacer></v-spacer>
                        <span class="text-caption">{{ topic.progress }}% acertividade</span>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <!-- Diálogo de confirmação -->
        <v-dialog v-model="deleteDialog" max-width="400">
            <v-card>
                <v-card-title class="text-h6">Confirmar exclusão</v-card-title>
                <v-card-text>
                    Deseja remover o tópico "{{ topicToDelete?.title }}"?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey-darken-1" variant="text" @click="deleteDialog = false">
                        Cancelar
                    </v-btn>
                    <v-btn color="red-darken-1" variant="flat" @click="deleteTopic">
                        Remover
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
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

// Controle do diálogo de exclusão
const deleteDialog = ref(false)
const topicToDelete = ref(null)

function confirmDelete(topic) {
    topicToDelete.value = topic
    deleteDialog.value = true
}

function deleteTopic() {
    if (topicToDelete.value) {
        topics.value = topics.value.filter(t => t.id !== topicToDelete.value.id)
        deleteDialog.value = false
    }
}

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
.action-btn {
    min-width: 220px;
    font-weight: 500;
    transition: transform 0.15s ease-in-out;
}

.action-btn:hover {
    transform: scale(1.02);
}

.topic-card {
    transition: all 0.2s ease;
    position: relative;
    /* Para posicionar o botão de fechar */
}

.topic-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.close-btn {
    position: absolute;
    top: 4px;
    right: 4px;
    opacity: 0.5;
    transition: opacity 0.2s;
}

.close-btn:hover {
    opacity: 1;
}
</style>