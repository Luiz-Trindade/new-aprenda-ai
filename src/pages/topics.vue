<template>
    <v-container class="fade-in fill-height d-flex align-center justify-center">
        <v-row>
            <v-col cols="12" class="d-flex flex-column align-center">
                <v-list-subheader class="mb-4 text-center">
                    <v-icon class="mr-2" color="primary">mdi-format-list-bulleted</v-icon>
                    Tópicos
                </v-list-subheader>

                <!-- Botão para adicionar novo tópico -->
                <v-btn color="primary" class="mb-6 action-btn" :elevation="4" rounded="xl" @click="addDialog = true">
                    <v-icon start>mdi-plus</v-icon>
                    Novo Tópico
                </v-btn>

                <!-- Lista simplificada de tópicos -->
                <v-card v-for="topic in topics" :key="topic.id" class="mb-3 topic-card elevation-2" width="100%">
                    <!-- Botão de fechar -->
                    <v-btn icon variant="text" size="x-small" class="close-btn" @click.stop="confirmDelete(topic)">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>

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
                        <v-btn class="elevation-2" variant="flat" rounded="xl" color="warning" @click="startQuiz(topic.id, topic.title, topic.difficulty)" size="small">
                            <v-icon start class="mr-1">mdi-lightbulb</v-icon>
                            Testar
                        </v-btn>
                        <v-spacer></v-spacer>
                        <span class="text-caption">{{ topic.progress || 0 }}% de acertividade</span>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <!-- Diálogo de adicionar tópico -->
        <v-dialog v-model="addDialog" max-width="500">
            <v-card>
                <v-card-title class="text-h6">Adicionar Novo Tópico</v-card-title>
                <v-card-text>
                    <v-text-field v-model="newTopic.title" label="Nome do Tópico" class="mb-4" clearable></v-text-field>

                    <v-select v-model="newTopic.difficulty" :items="difficultyLevels" label="Nível de Dificuldade"
                        variant="outlined"></v-select>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey-darken-1" variant="text" @click="addDialog = false">
                        Cancelar
                    </v-btn>
                    <v-btn color="primary" variant="flat" @click="addTopic"
                        :disabled="!newTopic.title || !newTopic.difficulty">
                        Adicionar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Diálogo de confirmação de exclusão -->
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Dados dos tópicos (agora carregados do localStorage)
const topics = ref([])

// Controles de diálogo
const addDialog = ref(false)
const deleteDialog = ref(false)
const topicToDelete = ref(null)

// Novo tópico
const newTopic = ref({
    title           : '',
    difficulty      : '',
    category        : 'ai', // Padrão
    questions       : 0,
    progress        : 0
})

// Opções de dificuldade
const difficultyLevels = [
    'Fácil', 
    'Médio', 
    'Difícil', 
    'Variado', 
    'Enem',
    'Concurso Público',
    'Simulado'
]

// Cores para cada nível de dificuldade
const getDifficultyColor = (difficulty) => {
    const colors = {
        'Fácil'             : 'green-lighten-2',
        'Médio'             : 'orange-lighten-2',
        'Difícil'           : 'red-lighten-2',
        'Variado'           : 'blue-lighten-2',
        'Enem'              : 'purple-lighten-2',
        'Concurso Público'  : 'teal-lighten-2',
        'Simulado'          : 'cyan-lighten-2'
    }
    return colors[difficulty] || 'grey-lighten-2'
}

// Carrega tópicos do localStorage quando o componente é montado
onMounted(() => {
    loadTopics()
})

// Carrega tópicos do localStorage
function loadTopics() {
    const savedTopics = localStorage.getItem('topics')
    if (savedTopics) {
        topics.value = JSON.parse(savedTopics)
    }
}

// Salva tópicos no localStorage
function saveTopics() {
    localStorage.setItem('topics', JSON.stringify(topics.value))
}

// Adiciona novo tópico
function addTopic() {
    const topic = {
        id              : Date.now().toString(),
        title           : newTopic.value.title,
        difficulty      : newTopic.value.difficulty,
        category        : 'ai', // Você pode adicionar um seletor de categoria depois
        questions       : 0,
        progress        : 0
    }

    topics.value.push(topic)
    saveTopics()

    // Reseta o formulário e fecha o diálogo
    newTopic.value = { title: '', difficulty: '', category: 'ai', questions: 0, progress: 0 }
    addDialog.value = false
}

// Confirma e remove tópico
function confirmDelete(topic) {
    topicToDelete.value = topic
    deleteDialog.value = true
}

function deleteTopic() {
    if (topicToDelete.value) {
        topics.value = topics.value.filter(t => t.id !== topicToDelete.value.id)
        saveTopics()
        deleteDialog.value = false
    }
}

// Métodos auxiliares
function getTopicIcon(category) {
    return {
        ai: 'mdi-robot',
        programming: 'mdi-code-braces',
        math: 'mdi-calculator'
    }[category] || 'mdi-book'
}

// Navegação
function startQuiz(topic_id, title, difficulty) {
    // router.push(`/quiz/${topicId}`);
    localStorage.setItem("topic_id", topic_id)
    localStorage.setItem("topic", title);
    localStorage.setItem("difficulty", difficulty);
    
    router.push("/quiz");
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