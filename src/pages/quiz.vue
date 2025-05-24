<template>
    <v-container class="fade-in">
        <!-- Tela de Introdução do Tópico -->
        <div v-if="!quizStarted" class="topic-intro">
            <v-card class="pa-6 mb-6" elevation="2">
                <v-card-title class="text-h5 mb-4" style="white-space: pre-line; word-break: break-word;">
                    <v-icon large color="primary" class="mr-2">{{ topicIcon }}</v-icon>
                    {{ currentTopic.title }}
                </v-card-title>

                <v-card-text class="text-body-1">
                    <div class="mb-4" v-for="(paragraph, index) in topicContent" :key="'para-' + index">
                        {{ paragraph }}
                    </div>

                    <v-alert type="info" variant="tonal" class="mt-6">
                        Este quiz contém 10 perguntas sobre o tema. Boa sorte!
                    </v-alert>
                </v-card-text>

                <v-card-actions>
                    <v-btn variant="flat" block rounded="xl" color="primary" size="large" @click="startQuiz" class="mt-4 elevation-2">
                        <v-icon start>mdi-play</v-icon>
                        Iniciar Quiz
                    </v-btn>
                </v-card-actions>
            </v-card>
        </div>

        <!-- Tela do Quiz -->
        <div v-else class="quiz-container">
            <v-card class="pa-6" elevation="2">
                <!-- Progresso -->
                <div class="d-flex justify-space-between align-center mb-4">
                    <span class="text-caption">Pergunta {{ currentQuestionIndex + 1 }} de {{ questions.length }}</span>
                    <v-chip color="primary">
                        Pontuação: {{ score }}/{{ questions.length }}
                    </v-chip>
                </div>

                <v-progress-linear :model-value="((currentQuestionIndex + 1) / questions.length) * 100" color="primary"
                    height="8" class="mb-6"></v-progress-linear>

                <!-- Pergunta Atual -->
                <v-card-title class="text-h6 mb-4" style="white-space: pre-line; word-break: break-word;">
                    {{ currentQuestion.text }}
                </v-card-title>

                <!-- Opções de Resposta -->
                <v-card-text>
                    <v-radio-group v-model="selectedAnswer">
                        <v-radio v-for="(option, index) in currentQuestion.options" :key="index" :label="option.text"
                            :value="index" color="primary" class="mb-2"></v-radio>
                    </v-radio-group>
                </v-card-text>

                <!-- Feedback -->
                <v-alert v-if="showFeedback" :type="answerIsCorrect ? 'success' : 'error'" variant="tonal" class="mb-4">
                    {{ answerIsCorrect ? 'Resposta correta!' : `Resposta incorreta! A correta é: ${correctAnswerText}`
                    }}
                </v-alert>

                <!-- Botões de Controle -->
                <v-card-actions class="justify-end">
                    <v-btn v-if="!showFeedback" color="primary" :disabled="selectedAnswer === null"
                        @click="checkAnswer">
                        Verificar
                    </v-btn>

                    <v-btn v-else color="primary" @click="nextQuestion">
                        {{ isLastQuestion ? 'Ver Resultado' : 'Próxima' }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </div>

        <!-- Diálogo de Resultado -->
        <v-dialog v-model="showResults">
            <v-card>
                <v-card-title class="text-h5" style="word-break: break-word;">
                    Resultado do Quiz
                </v-card-title>
                <v-card-text>
                    <div class="text-center py-4">
                        <v-progress-circular :size="120" :width="15" :model-value="(score / questions.length) * 100"
                            :color="resultColor" class="mb-4">
                            <span class="text-h5">{{ score }}/{{ questions.length }}</span>
                        </v-progress-circular>

                        <p class="text-h6 mt-4" style="white-space: pre-line; word-break: break-word;">
                            {{ resultMessage }}
                        </p>
                        <p class="text-body-1 mt-2" style="white-space: pre-line; word-break: break-word;">
                            {{ resultDescription }}
                        </p>
                    </div>
                </v-card-text>
                <v-card-actions class="justify-center">
                    <!-- <v-btn size="small" variant="flat" color="warning" @click="resetQuiz">Fazer outro quiz</v-btn> -->
                    <v-btn size="small" variant="flat" color="success" @click="router.push('/topics')">
                        Voltar aos tópicos
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Estado do Quiz
const quizStarted = ref(false)
const currentQuestionIndex = ref(0)
const selectedAnswer = ref(null)
const score = ref(0)
const showFeedback = ref(false)
const answerIsCorrect = ref(false)
const showResults = ref(false)

// Tópico atual (mockado - seria carregado do localStorage na prática)
const currentTopic = ref({
    id: '1',
    title: 'Introdução à Inteligência Artificial',
    difficulty: 'Médio',
    category: 'ai'
})

// Ícone do tópico
const topicIcon = computed(() => {
    return {
        ai: 'mdi-robot',
        programming: 'mdi-code-braces',
        math: 'mdi-calculator'
    }[currentTopic.value.category] || 'mdi-book'
})

// Conteúdo do tópico (mockado)
const topicContent = [
    'Inteligência Artificial (IA) é um ramo da ciência da computação que se concentra no desenvolvimento de sistemas capazes de realizar tarefas que normalmente exigiriam inteligência humana.',
    'Essas tarefas incluem aprendizado, raciocínio, resolução de problemas, percepção e compreensão de linguagem. A IA pode ser classificada em três tipos: IA estreita (ou fraca), IA geral (ou forte) e superinteligência.',
    'Aplicações comuns de IA incluem assistentes virtuais, carros autônomos, sistemas de recomendação e diagnósticos médicos. O aprendizado de máquina, um subcampo da IA, permite que os sistemas aprendam e melhorem com a experiência sem serem explicitamente programados.'
]

// Exemplo de pergunta
// {
//     text: 'O que é Inteligência Artificial?',
//         options: [
//             { text: 'Um tipo de hardware especializado', correct: false },
//             { text: 'Sistemas que imitam inteligência humana', correct: true },
//             { text: 'Uma linguagem de programação', correct: false },
//             { text: 'Um sistema operacional', correct: false }
//         ],
//             explanation: 'IA refere-se a sistemas que imitam funções cognitivas humanas.'
// },


// Perguntas do quiz (mockadas)
const questions = ref([
    {
        text: 'O que é Inteligência Artificial?',
        options: [
            { text: 'Um tipo de hardware especializado', correct: false },
            { text: 'Sistemas que imitam inteligência humana', correct: true },
            { text: 'Uma linguagem de programação', correct: false },
            { text: 'Um sistema operacional', correct: false }
        ],
        explanation: 'IA refere-se a sistemas que imitam funções cognitivas humanas.'
    },
    {
        text: 'Qual destes é um exemplo de IA estreita?',
        options: [
            { text: 'Um sistema que pode realizar qualquer tarefa intelectual humana', correct: false },
            { text: 'Um assistente virtual como Siri ou Alexa', correct: true },
            { text: 'Um robô com consciência própria', correct: false },
            { text: 'Um computador quântico', correct: false }
        ],
        explanation: 'Assistentes virtuais são exemplos de IA estreita, projetados para tarefas específicas.'
    },
    {
        text: 'O que é machine learning?',
        options: [
            { text: 'Programação explícita de regras', correct: false },
            { text: 'Sistemas que aprendem com dados', correct: true },
            { text: 'Montagem de computadores', correct: false },
            { text: 'Um tipo de rede neural biológica', correct: false }
        ],
        explanation: 'Machine learning é um subcampo da IA onde sistemas aprendem padrões a partir de dados.'
    },
    {
        text: 'Qual destes NÃO é um tipo de aprendizado de máquina?',
        options: [
            { text: 'Aprendizado supervisionado', correct: false },
            { text: 'Aprendizado não supervisionado', correct: false },
            { text: 'Aprendizado por reforço', correct: false },
            { text: 'Aprendizado manual', correct: true }
        ],
        explanation: 'Os três principais tipos são supervisionado, não supervisionado e por reforço.'
    },
    {
        text: 'O que é uma rede neural?',
        options: [
            { text: 'Um sistema de cabos de internet', correct: false },
            { text: 'Um algoritmo inspirado no cérebro humano', correct: true },
            { text: 'Um tipo de banco de dados', correct: false },
            { text: 'Um protocolo de comunicação', correct: false }
        ],
        explanation: 'Redes neurais são algoritmos inspirados na estrutura do cérebro biológico.'
    },
    {
        text: 'Qual destes é um desafio ético da IA?',
        options: [
            { text: 'Viés algorítmico', correct: false },
            { text: 'Privacidade de dados', correct: false },
            { text: 'Deslocamento de empregos', correct: false },
            { text: 'Todos os anteriores', correct: true }
        ],
        explanation: 'A IA apresenta vários desafios éticos incluindo todos esses mencionados.'
    },
    {
        text: 'O que é PLN (Processamento de Linguagem Natural)?',
        options: [
            { text: 'Uma linguagem de programação', correct: false },
            { text: 'Um ramo da IA que lida com linguagem humana', correct: true },
            { text: 'Um protocolo de rede', correct: false },
            { text: 'Um tipo de banco de dados', correct: false }
        ],
        explanation: 'PLN permite que computadores entendam, interpretem e gerem linguagem humana.'
    },
    {
        text: 'Qual empresa desenvolveu o ChatGPT?',
        options: [
            { text: 'Google', correct: false },
            { text: 'OpenAI', correct: true },
            { text: 'Microsoft', correct: false },
            { text: 'Amazon', correct: false }
        ],
        explanation: 'ChatGPT foi desenvolvido pela OpenAI.'
    },
    {
        text: 'O que é deep learning?',
        options: [
            { text: 'Um tipo de aprendizado profundo usando redes neurais com muitas camadas', correct: true },
            { text: 'Um método de programação detalhada', correct: false },
            { text: 'Um tipo de banco de dados', correct: false },
            { text: 'Um protocolo de internet', correct: false }
        ],
        explanation: 'Deep learning usa redes neurais com múltiplas camadas para aprender representações de dados.'
    },
    {
        text: 'Qual destes é um framework popular para deep learning?',
        options: [
            { text: 'TensorFlow', correct: false },
            { text: 'PyTorch', correct: false },
            { text: 'Keras', correct: false },
            { text: 'Todos os anteriores', correct: true }
        ],
        explanation: 'Todos são frameworks populares para desenvolvimento de modelos de deep learning.'
    }
])

// Computed properties
const currentQuestion = computed(() => {
    return questions.value[currentQuestionIndex.value]
})

const isLastQuestion = computed(() => {
    return currentQuestionIndex.value === questions.value.length - 1
})

const correctAnswerText = computed(() => {
    const correctIndex = currentQuestion.value.options.findIndex(opt => opt.correct)
    return currentQuestion.value.options[correctIndex].text
})

const resultColor = computed(() => {
    const percentage = (score.value / questions.value.length) * 100
    if (percentage >= 80) return 'success'
    if (percentage >= 50) return 'warning'
    return 'error'
})

const resultMessage = computed(() => {
    const percentage = (score.value / questions.value.length) * 100
    if (percentage >= 80) return 'Excelente!'
    if (percentage >= 50) return 'Bom trabalho!'
    return 'Continue praticando!'
})

const resultDescription = computed(() => {
    const percentage = (score.value / questions.value.length) * 100
    if (percentage >= 80) return 'Você demonstrou um ótimo entendimento do tema.'
    if (percentage >= 50) return 'Você tem um bom conhecimento básico, mas pode melhorar.'
    return 'Recomendamos revisar o material e tentar novamente.'
})

// Métodos
function startQuiz() {
    quizStarted.value = true
}

function checkAnswer() {
    showFeedback.value = true
    answerIsCorrect.value = currentQuestion.value.options[selectedAnswer.value].correct

    if (answerIsCorrect.value) {
        score.value++
    }
}

function nextQuestion() {
    showFeedback.value = false
    selectedAnswer.value = null

    if (isLastQuestion.value) {
        showResults.value = true
    } else {
        currentQuestionIndex.value++
    }
}

function resetQuiz() {
    quizStarted.value = false
    currentQuestionIndex.value = 0
    selectedAnswer.value = null
    score.value = 0
    showFeedback.value = false
    showResults.value = false
}

// Carregar tópico do localStorage (simulado)
onMounted(() => {
    // Na prática, você carregaria do localStorage:
    // const savedTopic = localStorage.getItem('test_topic')
    // if (savedTopic) currentTopic.value = JSON.parse(savedTopic)

    // Mockando um tópico para demonstração
    currentTopic.value = {
        id: '1',
        title: 'Introdução à Inteligência Artificial',
        difficulty: 'Médio',
        category: 'ai'
    }
})
</script>

<style scoped>
.topic-intro {
    max-width: 800px;
    margin: 0 auto;
}

.quiz-container {
    max-width: 800px;
    margin: 0 auto;
}

.v-radio-group {
    margin-top: 16px;
}

.v-radio {
    align-items: flex-start;
    margin-bottom: 8px;
}

.v-radio :deep(.v-selection-control__wrapper) {
    margin-top: 2px;
}
</style>