<template>
    <v-container class="fade-in fill-height d-flex align-center justify-center">
        <!-- Tela de Introdução do Tópico -->
        <div v-if="!quizStarted" class="topic-intro">
            <v-card class="pa-6 mb-6" elevation="2">
                <v-card-title class="text-h5 mb-4" style="white-space: pre-line; word-break: break-word;">
                    <v-icon large color="primary" class="mr-2">{{ topicIcon }}</v-icon>
                    {{ currentTopic.title }}
                </v-card-title>

                <v-card-text class="text-body-1">
                    <div v-if="loading" class="d-flex align-center justify-center flex-column">
                        <v-progress-circular class="mb-2" :size="70" :width="7" color="blue"
                            indeterminate></v-progress-circular>
                        <h4>Carregando conteúdo...</h4>
                    </div>

                    <div v-else>
                        <div v-for="(paragraph, index) in topicContent" :key="'para-' + index" class="mb-4">
                            {{ paragraph }}
                        </div>
                        <v-alert type="info" variant="tonal" class="mt-6">
                            Este quiz contém {{ questions.length }} perguntas sobre o tema. Boa sorte!
                        </v-alert>
                    </div>
                </v-card-text>

                <v-card-actions>
                    <v-btn variant="flat" block rounded="xl" color="primary" size="large" class="mt-4 elevation-2"
                        @click="startQuiz" :disabled="loading || !contentReady">
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
        <v-dialog v-model="showResults" persistent>
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
                    <v-btn size="small" variant="flat" color="success" @click="setTopicProperties()">
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
            // Estados de carregamento
            loading: true,
            contentReady: false,

            // Estado do Quiz
            startQuizTime: new Date(),
            quizStarted: false,
            currentQuestionIndex: 0,
            selectedAnswer: null,
            score: 0,
            showFeedback: false,
            answerIsCorrect: false,
            showResults: false,

            // Tópico atual
            currentTopic: {
                id: '1',
                title: '',
                difficulty: '',
                category: ''
            },

            // Conteúdo do tópico
            topicContent: ["Aguarde, texto sendo gerado..."],
            questions: [],
            userAnswers: [] // Novo array para armazenar as respostas
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
        async loadContent() {
            try {
                this.loading = true;
                this.contentReady = false;

                // Executa ambas as requisições em paralelo
                await Promise.all([
                    this.fetchTopicText(),
                    this.fetchTopicQuiz()
                ]);

                this.contentReady = true;
            } catch (error) {
                console.error('Erro ao carregar conteúdo:', error);
                // Tratamento de erro básico
                this.topicContent = ["Ocorreu um erro ao carregar o conteúdo. Por favor, tente novamente."];
            } finally {
                this.loading = false;
            }
        },

        async fetchTopicText() {
            const topic = localStorage.getItem("topic");
            const difficulty = localStorage.getItem("difficulty");

            const response = await fetch(`${this.endpoint}/generate_topic_text/${topic}/${difficulty}/`);
            const data = await response.json();
            this.topicContent = this.formatTopicText(data);
        },

        async fetchTopicQuiz() {
            const topic = localStorage.getItem("topic");
            const difficulty = localStorage.getItem("difficulty");

            const response = await fetch(`${this.endpoint}/generate_topic_quiz/${topic}/${difficulty}/`);
            const data = await response.json();
            this.questions = this.extractJsonFromFormattedString(data);
        },

        startQuiz() {
            this.quizStarted = true
        },
        checkAnswer() {
            this.showFeedback = true
            const opt = this.currentQuestion.options[this.selectedAnswer]
            this.answerIsCorrect = opt && opt.correct

            // Armazena a resposta do usuário
            this.storeUserAnswer();

            if (this.answerIsCorrect) {
                this.score++
            }
        },
        // Nova função para armazenar a resposta
        storeUserAnswer() {
            this.userAnswers.push({
                questionIndex: this.currentQuestionIndex,
                questionText: this.currentQuestion.text,
                selectedOptionIndex: this.selectedAnswer,
                selectedOptionText: this.currentQuestion.options[this.selectedAnswer]?.text,
                isCorrect: this.answerIsCorrect,
                correctAnswerText: this.correctAnswerText,
                timestamp: new Date()
            });

            console.log("Resposta armazenada:", this.userAnswers[this.userAnswers.length - 1]);
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
        formatTopicText(topicData) {
            if (!topicData || typeof topicData.topic_text !== 'string') {
                return [];
            }

            // Remove cabeçalhos markdown (###, ####, etc.)
            const cleanText = topicData.topic_text.replace(/^#+\s/gm, '');

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
                return [];
            }
        },
        setTopicProperties() {
            const topic_id = localStorage.getItem("topic_id");
            const score = parseInt(this.score);
            const questions_quantity = parseInt(this.questions.length);
            const precision = parseFloat(((score / questions_quantity) * 100).toFixed(2));

            this.updateTopicProgress(topic_id, precision);
            this.updateTopicQuestions(topic_id, questions_quantity);

            const quizTotalTime = this.getTimeDifferenceUnit(this.startQuizTime);
            const timeString = `${quizTotalTime.value} ${quizTotalTime.unit}`;
            localStorage.setItem("quiz_total_time", timeString);
            
            // Salva as respostas no localStorage
            localStorage.setItem(topic_id, JSON.stringify(this.userAnswers));
            console.log("Todas as respostas salvas:", this.userAnswers);

            this.$router.push('/topics');
        },
        updateTopicProgress(id, newProgress) {
            const topicsJson = localStorage.getItem('topics');
            const topics = JSON.parse(topicsJson || '[]');

            const topic = topics.find(t => t.id === id);
            if (topic) {
                topic.progress = newProgress;
                localStorage.setItem('topics', JSON.stringify(topics));
            }
        },
        updateTopicQuestions(id, newQuestions) {
            const topicsJson = localStorage.getItem('topics');
            const topics = JSON.parse(topicsJson || '[]');

            const topic = topics.find(t => t.id === id);
            if (topic) {
                topic.questions = Number(topic.questions) + Number(newQuestions);
                localStorage.setItem('topics', JSON.stringify(topics));
            }
        },
        getTimeDifferenceUnit(fromDate, toDate = new Date()) {
            const ms = toDate - fromDate;
            const seconds = Math.floor(ms / 1000);
            const minutes = Math.floor(ms / 60000);
            const hours = Math.floor(ms / 3600000);
            const days = Math.floor(ms / 86400000);
            const months = Math.floor(days / 30.44);
            const years = Math.floor(days / 365.25);

            if (years >= 1) return { value: years, unit: "ano(s)" };
            if (months >= 1) return { value: months, unit: "mês(es)" };
            if (days >= 1) return { value: days, unit: "dia(s)" };
            if (hours >= 1) return { value: hours, unit: "hora(s)" };
            if (minutes >= 1) return { value: minutes, unit: "minuto(s)" };
            return { value: seconds, unit: "segundo(s)" };
        }
    },

    mounted() {
        this.setTopicTitle();
        this.loadContent();
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