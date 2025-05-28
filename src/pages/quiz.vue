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
                    <v-btn 
                        variant="flat" 
                        block rounded="xl" 
                        color="primary" 
                        size="large" 
                        @click="startQuiz" 
                        class="mt-4 elevation-2"
                    >
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
                    <v-btn size="small" variant="flat" color="success" @click="this.$router.push('/topics')">
                        Voltar aos tópicos
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
export default {
    name: 'QuizComponent',

    data() {
        return {
            // Estado do Quiz
            quizStarted: false,
            currentQuestionIndex: 0,
            selectedAnswer: null,
            score: 0,
            showFeedback: false,
            answerIsCorrect: false,
            showResults: false,

            // Tópico atual (mockado – você pode carregar do localStorage)
            currentTopic: {
                id: '1',
                title: 'Introdução à Inteligência Artificial',
                difficulty: 'Médio',
                category: 'ai'
            },

            // Conteúdo do tópico (mockado)
            topicContent: [
                /*'Inteligência Artificial (IA) é um ramo da ciência da computação que se concentra no desenvolvimento de sistemas capazes de realizar tarefas que normalmente exigiriam inteligência humana.',
                'Essas tarefas incluem aprendizado, raciocínio, resolução de problemas, percepção e compreensão de linguagem. A IA pode ser classificada em três tipos: IA estreita (ou fraca), IA geral (ou forte) e superinteligência.',
                'Aplicações comuns de IA incluem assistentes virtuais, carros autônomos, sistemas de recomendação e diagnósticos médicos. O aprendizado de máquina, um subcampo da IA, permite que os sistemas aprendam e melhorem com a experiência sem serem explicitamente programados.'*/
                "Aguarde, texto sendo gerado..."
            ],

            // Perguntas do quiz (mockadas)
            questions: [
                /*{
                    text: 'O que é Inteligência Artificial?',
                    options: [
                        { text: 'Um tipo de hardware especializado', correct: false },
                        { text: 'Sistemas que imitam inteligência humana', correct: true },
                        { text: 'Uma linguagem de programação', correct: false },
                        { text: 'Um sistema operacional', correct: false }
                    ],
                    explanation: 'IA refere-se a sistemas que imitam funções cognitivas humanas.'
                },*/
                // ... (outras perguntas mantidas iguais)
            ]
        }
    },

    computed: {
        topicIcon() {
            const icons = {
                ai: 'mdi-robot',
                programming: 'mdi-code-braces',
                math: 'mdi-calculator'
            }
            return icons[this.currentTopic.category] || 'mdi-book'
        },
        currentQuestion() {
            return this.questions[this.currentQuestionIndex]
        },
        isLastQuestion() {
            return this.currentQuestionIndex === this.questions.length - 1
        },
        correctAnswerText() {
            const opt = this.currentQuestion.options.find(o => o.correct)
            return opt ? opt.text : ''
        },
        resultColor() {
            const pct = (this.score / this.questions.length) * 100
            if (pct >= 80) return 'success'
            if (pct >= 50) return 'warning'
            return 'error'
        },
        resultMessage() {
            const pct = (this.score / this.questions.length) * 100
            if (pct >= 80) return 'Excelente!'
            if (pct >= 50) return 'Bom trabalho!'
            return 'Continue praticando!'
        },
        resultDescription() {
            const pct = (this.score / this.questions.length) * 100
            if (pct >= 80) return 'Você demonstrou um ótimo entendimento do tema.'
            if (pct >= 50) return 'Você tem um bom conhecimento básico, mas pode melhorar.'
            return 'Recomendamos revisar o material e tentar novamente.'
        }
    },

    methods: {
        startQuiz() {
            this.quizStarted = true
        },
        checkAnswer() {
            this.showFeedback = true
            const opt = this.currentQuestion.options[this.selectedAnswer]
            this.answerIsCorrect = opt && opt.correct

            if (this.answerIsCorrect) {
                this.score++
            }
        },
        nextQuestion() {
            this.showFeedback = false
            this.selectedAnswer = null

            if (this.isLastQuestion) {
                this.showResults = true
            } else {
                this.currentQuestionIndex++
            }
        },
        resetQuiz() {
            this.quizStarted = false
            this.currentQuestionIndex = 0
            this.selectedAnswer = null
            this.score = 0
            this.showFeedback = false
            this.showResults = false
        },
        fetchTopicText() {
            // Usa a variável global `endpoint`
            const topic = localStorage.getItem("topic");
            const difficulty = localStorage.getItem("difficulty")

            fetch(`${this.endpoint}/generate_topic_text/${topic}/${difficulty}/`)
                .then(res => res.json())
                .then(data => {
                    // faça algo com a resposta
                    console.log(data);
                    this.topicContent = this.formatTopicText(data);
                })
                .catch(err => console.error(err))
        },
        formatTopicText(topicData) {
            if (!topicData || typeof topicData.topic_text !== 'string') {
                return [];
            }

            // Remove cabeçalhos markdown (###, ####, etc.)
            const cleanText = topicData.topic_text.replace(/^#+\s*/gm, '');

            // Divide por dois ou mais line breaks para isolar os parágrafos
            const paragraphs = cleanText.split(/\n{2,}/).map(p => p.trim()).filter(p => p);

            return paragraphs;
        },
        setTopicTitle() {
            const topic = localStorage.getItem("topic");
            const difficulty = localStorage.getItem("difficulty")

            this.currentTopic.title = topic;
            this.currentTopic.difficulty = difficulty;
        },
        fetchTopicQuiz() {
            // Usa a variável global `endpoint`
            const topic = localStorage.getItem("topic");
            const difficulty = localStorage.getItem("difficulty")
            console.log("QUIZ")

            fetch(`${this.endpoint}/generate_topic_quiz/${topic}/${difficulty}/`)
                .then(res => res.json())
                .then(data => {
                    // faça algo com a resposta
                    console.log(data);
                    this.questions = this.extractJsonFromFormattedString(data);
                })
                .catch(err => console.error(err))
        },
        extractJsonFromFormattedString(input) {
            try {
                const raw = input.topic_quiz;

                // Remove as marcações de bloco de código (ex: ```json\n ... \n```)
                const cleaned = raw.replace(/```json\n?/, '').replace(/\n?```$/, '');

                // Faz o parse do JSON limpo
                const parsed = JSON.parse(cleaned);
                return parsed;
            } catch (error) {
                console.error('Erro ao extrair JSON:', error);
                return null;
            }
        }

    },

    mounted() {
        // Aqui você pode carregar o tópico de localStorage, se quiser:
        // const saved = localStorage.getItem('current_topic')
        // if (saved) this.currentTopic = JSON.parse(saved)
        this.setTopicTitle();
        this.fetchTopicText();
        this.fetchTopicQuiz();
    }
}
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