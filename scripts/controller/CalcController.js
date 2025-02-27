class CalcController {

    constructor() {
        // Cria um objeto de áudio para tocar som ao clicar nos botões
        this._audio = new Audio('click.mp3');
        this._audioOnOff = false; // Controle para ativar/desativar o som

        this._lastOperator = ''; // Último operador utilizado
        this._lastNumber = ''; // Último número inserido

        this._operation = []; // Array que armazena as operações
        this._locale = 'pt-BR'; // Localização para exibição de data e hora

        // Seleciona os elementos da calculadora no HTML
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate; // Armazena a data atual

        // Inicializa as configurações da calculadora
        this.initialize();
        this.initButtonsEvents(); // Inicializa os eventos dos botões
        this.initKeyboard(); // Inicializa os eventos do teclado
    }

    // Função para permitir colar valores do clipboard (Área de transferência)
    pasteFromClipboard() {
        document.addEventListener('paste', e => {
            let text = e.clipboardData.getData('Text'); // Obtém o texto copiado
            this.displayCalc = parseFloat(text); // Define no display
        });
    }

    // Função para copiar o valor do display para a área de transferência
    copyToClipboard() {
        let input = document.createElement('input'); // Cria um campo de input temporário
        input.value = this.displayCalc; // Define o valor do input como o número do display
        document.body.appendChild(input); // Adiciona o input ao corpo do documento
        input.select(); // Seleciona o valor do input
        document.execCommand("Copy"); // Copia o valor para o clipboard
        input.remove(); // Remove o input temporário
    }

    // Inicializa as configurações da calculadora
    initialize() {
        this.setDisplayDateTime(); // Atualiza a data e a hora no display

        setInterval(() => {
            this.setDisplayDateTime(); // Atualiza a cada segundo
        }, 1000);

        this.setLastNumberToDisplay(); // Exibe o último número digitado
        this.pasteFromClipboard(); // Ativa a função de colar do clipboard

        // Permite ativar ou desativar o som ao clicar duas vezes no botão AC
        document.querySelectorAll('.btn-ac').forEach(btn => {
            btn.addEventListener('dblclick', e => {
                this.toggleAudio();
            });
        });
    }

    // Alterna o áudio entre ligado e desligado
    toggleAudio() {
        this._audioOnOff = !this._audioOnOff;
    }

    // Toca o áudio quando ativado
    playAudio() {
        if (this._audioOnOff) {
            this._audio.currentTime = 0;
            this._audio.play();
        }
    }

    // Captura eventos do teclado
    initKeyboard() {
        document.addEventListener('keyup', e => {
            this.playAudio();

            switch (e.key) {
                case 'Escape':
                    this.clearAll(); // Limpa tudo
                    break;
                case 'Backspace':
                    this.clearEntry(); // Apaga último número
                    break;
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperation(e.key); // Adiciona operador
                    break;
                case 'Enter':
                case '=':
                    this.calc(); // Realiza o cálculo
                    break;
                case '.':
                case ',':
                    this.addDot(); // Adiciona ponto decimal
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key)); // Adiciona número
                    break;
                case 'c':
                    if (e.ctrlKey) this.copyToClipboard(); // Copia para clipboard
                    break;
            }
        });
    }

    // Adiciona eventos a múltiplos elementos
    addEventListenerAll(element, events, fn) {
        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false);
        });
    }

    // Limpa todas as operações
    clearAll() {
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();
    }

    // Apaga o último valor digitado
    clearEntry() {
        this._operation.pop();
        this.setLastNumberToDisplay();
    }

    // Retorna o último valor inserido
    getLastOperation() {
        return this._operation[this._operation.length - 1];
    }

    // Define o último valor inserido
    setLastOperation(value) {
        this._operation[this._operation.length - 1] = value;
    }

    // Verifica se um valor é um operador matemático
    isOperator(value) {
        return ['+', '-', '*', '%', '/'].includes(value);
    }

    // Executa o cálculo da operação
    calc() {
        let result = eval(this._operation.join('')); // Calcula a operação
        this._operation = [result]; // Salva o resultado
        this.setLastNumberToDisplay(); // Atualiza o display
    }

    // Atualiza o display com o último número
    setLastNumberToDisplay() {
        let lastNumber = this.getLastOperation(false);
        if (!lastNumber) lastNumber = 0;
        this.displayCalc = lastNumber;
    }

    // Adiciona um ponto decimal ao número
    addDot() {
        let lastOperation = this.getLastOperation();
        if (typeof lastOperation === 'string' && lastOperation.includes('.')) return;
        if (this.isOperator(lastOperation) || !lastOperation) {
            this.pushOperation('0.');
        } else {
            this.setLastOperation(lastOperation.toString() + '.');
        }
        this.setLastNumberToDisplay();
    }

    // Define a data e hora no display
    setDisplayDateTime() {
        this.displayDate = new Date().toLocaleDateString(this._locale, {
            day: "2-digit", month: "long", year: "numeric"
        });
        this.displayTime = new Date().toLocaleTimeString(this._locale);
    }

    get displayCalc() { return this._displayCalcEl.innerHTML; }
    set displayCalc(value) { this._displayCalcEl.innerHTML = value; }
    get displayDate() { return this._dateEl.innerHTML; }
    set displayDate(value) { this._dateEl.innerHTML = value; }
    get displayTime() { return this._timeEl.innerHTML; }
    set displayTime(value) { this._timeEl.innerHTML = value; }
}
